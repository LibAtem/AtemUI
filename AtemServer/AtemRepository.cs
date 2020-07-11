using System;
using System.Collections.Generic;
using System.Linq;
using AtemServer.Hubs;
using LibAtem;
using LibAtem.DeviceProfile;
using log4net;
using LibAtem.Net;
using LibAtem.Discovery;
using LibAtem.State;
using LibAtem.State.Builder;
using LiteDB;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using AtemServer.Controllers;
using LibAtem.Net.DataTransfer;
using LibAtem.Common;
using LibAtem.Util.Media;
using System.Drawing;
using System.IO;
using LibAtem.Util;

namespace AtemServer
{
    public static class AtemDeviceExt
    {
        public static string Id(string address, int port)
        {
            return string.Format("{0}:{1}", address, port);
        }
        public static string Id(this AtemDeviceInfo info)
        {
            return AtemDeviceExt.Id(info.Address, info.Port);
        }
    }

    public class AtemClientExt
    {
        private readonly string _deviceId;
        private readonly DeviceProfileHandler _profile;
        private readonly List<MediaPoolImage> _images;
        private readonly AtemState _state;
        private readonly IHubContext<DevicesHub> context_;
        private readonly HashSet<string> _subscriptions;

        public AtemClientExt(string deviceId, AtemClient client, IHubContext<DevicesHub> _context, HashSet<string> subscriptions)
        {
            _deviceId = deviceId;
            _profile = new DeviceProfileHandler();
            _subscriptions = subscriptions;
            _state = new AtemState();
            context_ = _context;
            _images = new List<MediaPoolImage>();
            Client = client;
            Client.OnReceive += _profile.HandleCommands;
            Client.OnConnection += sender =>
            {
                Connected = true;
                SendState(GetState());
            };
            Client.OnDisconnect += sender =>
            {
                Connected = false;
                SendState(null);
            };

            Client.OnReceive += async (sender, commands) =>
            {
                var changedPaths = new HashSet<string>();
                var errors = new List<string>();
                lock (_state)
                {
                    foreach (var command in commands)
                    {
                        var res = AtemStateBuilder.Update(_state, command);
                        changedPaths.AddRange(res.ChangedPaths);

                        if (!res.Success)
                        {
                            if (res.Errors.Count > 0)
                            {
                                errors.AddRange(res.Errors);
                            }
                            else
                            {
                                errors.Add($"Failed to update state for {command.GetType().Name}");
                            }
                        }
                    }
                }

                AtemState newState = GetState();
                /*
                var diffs = new Dictionary<string, object>();
                foreach (string path in changedPaths)
                {
                    diffs.Add(path, new object()); // TODO
                }*/

                SendStateDiff(GetState(), changedPaths);

                for (var i = 0; i < _state.MediaPool.Stills.Count; i++)
                {
                    if (_state.MediaPool.Stills[i].IsUsed)
                    {
                        if (_images.Where(p => p.Hash.SequenceEqual(_state.MediaPool.Stills[i].Hash)).ToList().Count == 0)
                        {
                            MediaPoolImage im = new MediaPoolImage();
                            im.Hash = _state.MediaPool.Stills[i].Hash;
                            im.Downloaded = false;
                            _images.Add(im);

                            var job = new DownloadMediaStillJob((uint)i, VideoModeResolution._1080, ((AtemFrame frame) => {

                                if (frame != null)
                                {
                                    Console.WriteLine("Downloaded");
                                    byte[] data = frame.GetRGBA(ColourSpace.BT709);
                                    Bitmap pic = new Bitmap(1920, 1080, System.Drawing.Imaging.PixelFormat.Format32bppArgb);

                                    for (int x = 0; x < 1920; x++)
                                    {
                                        for (int y = 0; y < 1080; y++)
                                        {
                                            int arrayIndex = (y * 1920 + x) * 4;
                                            Color c = Color.FromArgb(data[arrayIndex + 3], data[arrayIndex], data[arrayIndex + 1], data[arrayIndex + 2]);
                                            pic.SetPixel(x, y, c);
                                        }
                                    }
                                    //pic.Save("output.jpg", ImageFormat.Jpeg);  // Or Png
                                    MemoryStream ms = new MemoryStream();
                                    pic.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);

                                    im.Base64 = Convert.ToBase64String(ms.ToArray());
                                    im.Downloaded = true;
                                }
                                else
                                {
                                    _images.Remove(im);
                                }

                            }));
                            Client.DataTransfer.QueueJob(job);
                        }
                    }
                }
            };
        }

        public DeviceProfile GetProfile()
        {
            lock (_profile)
            {
                return _profile.Profile;
            }
        }

        private List<string> GetClientIds()
        {
            lock (_subscriptions)
            {
                return new List<string>(_subscriptions);
            }
        }

        private void SendState(AtemState state)
        {
            context_.Clients.Clients(GetClientIds()).SendAsync("state", new AtemStateWrapped{
                State = state,
                DeviceId = _deviceId
            });
        }
        
        private void SendStateDiff(AtemState state, HashSet<string> paths/*Dictionary<string, object> diffs*/)
        {
            context_.Clients.Clients(GetClientIds()).SendAsync("stateDiff", new AtemStateDiff(){
                State = state,
                Paths = paths,
                DeviceId = _deviceId
            });
        }

        public AtemState GetState()
        {
            lock (_state)
            {
                return _state.Clone();
            }
        }

        public MediaPoolImage GetImage(string Name)
        {
                byte[] bytes = Convert.FromBase64String(Name);

            var imageList = _images.Where(p => (p.Hash.SequenceEqual(bytes))).ToList();
                if (imageList.Count == 1)
                {
                    return imageList[0];
                }

                return null;
        }

        public AtemClient Client { get; }
        
        public bool Connected { get; private set; }
        public string Version => Client?.ConnectionVersion?.ToVersionString();

        public DeviceProfile Profile => _profile.Profile;
    }
    public class AtemDevice
    {
        public AtemDeviceInfo Info { get; set; }
        
        public bool Enabled { get; set; }
        
        public bool Remember { get; set; }
        
        [BsonIgnore]
        [JsonIgnore]
        public AtemClientExt Client { get; set; }

        [BsonIgnore]
        [JsonIgnore]
        public HashSet<string> Subscriptions { get; set; }
        
        public bool Connected => Client?.Connected ?? false;
        public string Version => Client?.Version;

        public AtemDevice(AtemDeviceInfo info)
        {
            Info = info;
        }
        private AtemDevice()
        {
            // For LiteDB
        }
    }
    
    public class AtemStateWrapped
    {
        public string DeviceId { get; set; }
        public AtemState State { get; set; }
    }

    public class AtemStateDiff
    {
        public string DeviceId { get; set; }
        //public Dictionary<string, object> Diffs { get; set; }
        public AtemState State { get; set; }
        public HashSet<string> Paths { get; set; }
    }
    
    public class AtemRepository
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(AtemClient));

        private readonly LiteDatabase db;
        private readonly LiteCollection<AtemDevice> dbDevices;
        private readonly Dictionary<string, AtemDevice> devices;

        private readonly AtemDiscoveryService discovery;
        private readonly IHubContext<DevicesHub> context_;

        static AtemRepository()
        {
            // Workaround due to AtemDeviceInfo not having property setters
            BsonMapper.Global.RegisterType<AtemDeviceInfo>
            (
                serialize: (info) => JsonConvert.SerializeObject(info),
                deserialize: (bson) => JsonConvert.DeserializeObject<AtemDeviceInfo>(bson.AsString)
            );
        }

        public AtemRepository(IHubContext<DevicesHub> context)
        {
            db = new LiteDatabase(@"MyData.db");
            dbDevices = db.GetCollection<AtemDevice>("devices");
            devices = new Dictionary<string, AtemDevice>();

            context_ = context;

            // Load up old devices
            foreach (AtemDevice device in dbDevices.FindAll())
            {
                device.Subscriptions = new HashSet<string>();
                SetupConnection(device);
                devices[device.Info.Id()] = device;
            }
            
            discovery = new AtemDiscoveryService();
            discovery.OnDeviceSeen += OnDeviceSeen;
            discovery.OnDeviceLost += OnDeviceLost;
        }

        public AtemState SubscribeClient(string connectionId, string deviceId)
        {
            AtemDevice device;
            lock (devices)
            {
                device = devices[deviceId];
            }

            if (device == null)
            {
                throw new Exception("Bad deviceId");
            }

            lock (device.Subscriptions)
            {
                device.Subscriptions.Add(connectionId);
            }

            // Send the initial state
            return device.Client?.GetState();
        }
        
        public void UnsubscribeClient(string connectionId, string deviceId)
        {
            AtemDevice device;
            lock (devices)
            {
                device = devices[deviceId];
            }

            if (device == null)
            {
                throw new Exception("Bad deviceId");
            }

            lock (device.Subscriptions)
            {
                device.Subscriptions.Remove(connectionId);
            }
        }

        public void DisconnectClient(string connectionId)
        {
            lock (devices)
            {
                foreach (var device in devices)
                {
                    lock (device.Value.Subscriptions)
                    {
                        device.Value.Subscriptions.Remove(connectionId);
                    }
                }
            }
        }

        private void SetupConnection(AtemDevice device)
        {
            if (device.Enabled && device.Client == null)
            {
                device.Client = new AtemClientExt(device.Info.Id(), new AtemClient(device.Info.Address, false), context_, device.Subscriptions);
                // TODO setup listeners for stuff
                
                device.Client.Client.Connect();
            } else if (!device.Enabled && device.Client != null) {
                device.Client.Client.Dispose();
                device.Client = null;
                // TODO - send 'empty' state
            }
        }

        private void OnDeviceSeen(object sender, AtemDeviceInfo info)
        {
            var id = info.Id();
            lock (devices)
            {
                if (devices.TryGetValue(id, out AtemDevice device))
                {
                    device.Info = info;

                    // If remembered, sync changes to the db
                    if (device.Remember)
                        dbDevices.Update(id, device);
                }
                else
                {
                    devices[id] = new AtemDevice(info);
                    Log.InfoFormat("Discovered device: {0}", info.ToString());
                }

                context_.Clients.All.SendAsync("devices", ListDevices());
            }
        }
        private void OnDeviceLost(object sender, AtemDeviceInfo info)
        {
            var id = info.Id();

            lock (devices)
            {
                if (devices.TryGetValue(id, out AtemDevice device))
                {
                    Log.InfoFormat("Lost device: {0}", info.ToString());

                    if (!device.Remember)
                    {
                        devices.Remove(id);
                        
                        dbDevices.Delete(id); // Ensure its not in the db (it shouldnt be)
                    }
                    
                    // Ensure device is in expected state
                    SetupConnection(device);
                    
                    context_.Clients.All.SendAsync("devices", ListDevices());
                }
            }
        }

        public IReadOnlyList<AtemDevice> ListDevices()
        {
            lock (devices)
            {
                return devices.Select(d => d.Value).ToList();
            }
        }
        
        public AtemClientExt GetConnection(string id)
        {
            lock (devices)
            {
                return devices[id]?.Client;
            }
        }

        public Tuple<bool, IReadOnlyList<AtemDevice>> AddDevice(string address, int port)
        {
            var id = AtemDeviceExt.Id(address, port);

            lock (devices)
            {
                if (devices.TryGetValue(id, out AtemDevice device))
                {
                    device.Remember = true;
                    device.Enabled = true;


                    dbDevices.Upsert(id, device);
                    
                    // startup connection
                    SetupConnection(device);
                } else {
                    var doc = devices[id] = new AtemDevice(new AtemDeviceInfo(id, "", DateTime.MinValue, address, port, new List<string>()))
                    {
                        Remember = true, // Remember anything created manually
                        Enabled = true, // Enable for connections 
                    };

                    dbDevices.Upsert(id, doc);
                    
                    // startup connection
                    SetupConnection(doc);
                }
                
                return Tuple.Create(true, ListDevices());
            }
        }
        
        public Tuple<bool, IReadOnlyList<AtemDevice>> ForgetDevice(string address, int port)
        {
            var id = AtemDeviceExt.Id(address, port);

            lock (devices)
            {
                var changed = false;
                if (devices.TryGetValue(id, out AtemDevice device))
                {
                    // shutdown the connection
                    device.Enabled = false;
                    SetupConnection(device);
                    
                    dbDevices.Delete(id);
                    changed = devices.Remove(id);
                }
                
                return Tuple.Create(changed, ListDevices());
            }

        }
        
        public Tuple<bool, IReadOnlyList<AtemDevice>> SetDeviceEnabled(string address, int port, bool enabled)
        {
            var id = AtemDeviceExt.Id(address, port);

            lock (devices)
            {
                var changed = false;
                if (devices.TryGetValue(id, out AtemDevice device))
                {
                    // Set state
                    device.Enabled = enabled;
                    // Now we should remember it
                    device.Remember = true;

                    // Persist to db
                    dbDevices.Upsert(id, device);

                    // Ensure connection state
                    SetupConnection(device);
                    
                    changed = true;
                }

                return Tuple.Create(changed, ListDevices());
            }
        }

    }
}
