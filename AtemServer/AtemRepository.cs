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
using AtemServer.Services;
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
        private readonly AtemState _state;
        private readonly IHubContext<DevicesHub> context_;
        private readonly HashSet<string> _subscriptions;
        
        public readonly AtemMediaCache MediaCache = new AtemMediaCache();
        
        public delegate void DeviceChange(object sender);

        public event DeviceChange OnChange;

        public AtemClientExt(string deviceId, AtemClient client, IHubContext<DevicesHub> _context, HashSet<string> subscriptions)
        {
            _deviceId = deviceId;
            _profile = new DeviceProfileHandler();
            _subscriptions = subscriptions;
            _state = new AtemState();
            context_ = _context;
            Client = client;
            Client.OnReceive += _profile.HandleCommands;
            Client.OnConnection += sender =>
            {
                Connected = true;
                OnChange?.Invoke(this);
                SendState(GetState());
            };
            Client.OnDisconnect += sender =>
            {
                Connected = false;
                OnChange?.Invoke(this);
                SendState(null);
            };

            Client.OnReceive += (sender, commands) =>
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
                
                MediaCache.EnsureMediaIsDownloaded(Client, newState);
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

        public void SendState(AtemState state)
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
        
        public AtemMediaCacheItem GetImage(string hash)
        {
            return MediaCache.Get(hash);
        }

        public AtemClient Client { get; }
        
        public bool Connected { get; private set; }
        public string Version => Client?.ConnectionVersion?.ToVersionString();

        public DeviceProfile Profile => _profile.Profile;
    }
    public class AtemDevice
    {
        public AtemDeviceInfo Info { get; set; }
        
        /*
        [BsonIgnore]
        [JsonIgnore]
        public DateTime LastDiscovered { get; set; }
        */
        
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
            Subscriptions = new HashSet<string>();
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

        private readonly LiteDatabase _db;
        private readonly ILiteCollection<AtemDevice> _dbDevices;
        private readonly Dictionary<string, AtemDevice> _devices;

        private readonly AtemDiscoveryService _discovery;
        private readonly IHubContext<DevicesHub> _context;

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
            _db = new LiteDatabase(@"MyData.db");
            _dbDevices = _db.GetCollection<AtemDevice>("devices");
            _devices = new Dictionary<string, AtemDevice>();

            _context = context;

            // Load up old devices
            foreach (AtemDevice device in _dbDevices.FindAll())
            {
                device.Subscriptions = new HashSet<string>();
                SetupConnection(device);
                _devices[device.Info.Id()] = device;
            }
            
            _discovery = new AtemDiscoveryService(5000);
            _discovery.OnDeviceSeen += OnDeviceSeen;
            _discovery.OnDeviceLost += OnDeviceLost;
        }

        public AtemState SubscribeClient(string connectionId, string deviceId)
        {
            AtemDevice device;
            lock (_devices)
            {
                device = _devices[deviceId];
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
            lock (_devices)
            {
                device = _devices[deviceId];
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
            lock (_devices)
            {
                foreach (var device in _devices)
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
                device.Client = new AtemClientExt(device.Info.Id(), new AtemClient(device.Info.Address, false), _context, device.Subscriptions);
                device.Client.OnChange += sender =>
                {
                    if (sender is AtemClientExt client)
                    {
                        _context.Clients.All.SendAsync("devices", ListDevices());
                        Console.WriteLine($"Device state change {device?.Info?.Name ?? "-"} = {client.Connected}");
                    }
                };
                
                device.Client.Client.Connect();
            } else if (!device.Enabled && device.Client != null) {
                device.Client.Client.Dispose();
                device.Client.SendState(null);
                device.Client = null;
            }
        }

        private void OnDeviceSeen(object sender, AtemDeviceInfo info)
        {
            var id = info.Id();
            lock (_devices)
            {
                if (_devices.TryGetValue(id, out AtemDevice device))
                {
                    device.Info = info;

                    // If remembered, sync changes to the db
                    if (device.Remember)
                        _dbDevices.Update(id, device);
                }
                else
                {
                    _devices[id] = new AtemDevice(info);
                    Log.InfoFormat("Discovered device: {0}", info.ToString());
                }

                _context.Clients.All.SendAsync("devices", ListDevices());
            }
        }
        private void OnDeviceLost(object sender, AtemDeviceInfo info)
        {
            var id = info.Id();

            lock (_devices)
            {
                if (_devices.TryGetValue(id, out AtemDevice device))
                {
                    Log.InfoFormat("Lost device: {0}", info.ToString());

                    if (!device.Remember)
                    {
                        _devices.Remove(id);
                        
                        _dbDevices.Delete(id); // Ensure its not in the db (it shouldnt be)
                    }
                    
                    // Ensure device is in expected state
                    SetupConnection(device);
                    
                    _context.Clients.All.SendAsync("devices", ListDevices());
                }
            }
        }

        public IReadOnlyList<AtemDevice> ListDevices()
        {
            lock (_devices)
            {
                return _devices.Select(d => d.Value).ToList();
            }
        }
        
        public AtemClientExt GetConnection(string id)
        {
            lock (_devices)
            {
                return _devices.TryGetValue(id, out AtemDevice device) ? device.Client : null;
            }
        }

        public Tuple<bool, IReadOnlyList<AtemDevice>> AddDevice(string address, int port)
        {
            var id = AtemDeviceExt.Id(address, port);

            lock (_devices)
            {
                if (_devices.TryGetValue(id, out AtemDevice device))
                {
                    device.Remember = true;
                    device.Enabled = true;


                    _dbDevices.Upsert(id, device);
                    
                    // startup connection
                    SetupConnection(device);
                } else {
                    var doc = _devices[id] = new AtemDevice(new AtemDeviceInfo(id, "", DateTime.MinValue, address, port, new List<string>()))
                    {
                        Remember = true, // Remember anything created manually
                        Enabled = true, // Enable for connections 
                    };

                    _dbDevices.Upsert(id, doc);
                    
                    // startup connection
                    SetupConnection(doc);
                }
                
                return Tuple.Create(true, ListDevices());
            }
        }
        
        public Tuple<bool, IReadOnlyList<AtemDevice>> ForgetDevice(string address, int port)
        {
            var id = AtemDeviceExt.Id(address, port);

            lock (_devices)
            {
                var changed = false;
                if (_devices.TryGetValue(id, out AtemDevice device))
                {
                    // shutdown the connection
                    device.Enabled = false;
                    SetupConnection(device);
                    
                    // TODO - don't delete it, unless it has not been seen in a while
                    _dbDevices.Delete(id);
                    changed = _devices.Remove(id);
                }
                
                return Tuple.Create(changed, ListDevices());
            }

        }
        
        public Tuple<bool, IReadOnlyList<AtemDevice>> SetDeviceEnabled(string address, int port, bool enabled)
        {
            var id = AtemDeviceExt.Id(address, port);

            lock (_devices)
            {
                var changed = false;
                if (_devices.TryGetValue(id, out AtemDevice device))
                {
                    // Set state
                    device.Enabled = enabled;
                    // Now we should remember it
                    device.Remember = true;

                    // Persist to db
                    _dbDevices.Upsert(id, device);

                    // Ensure connection state
                    SetupConnection(device);
                    
                    changed = true;
                }

                return Tuple.Create(changed, ListDevices());
            }
        }

    }
}
