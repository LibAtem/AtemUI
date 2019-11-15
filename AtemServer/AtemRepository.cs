using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using AtemServer.Hubs;
using LibAtem;
using LibAtem.DeviceProfile;
using log4net;
using LibAtem.Net;
using LibAtem.Discovery;
using LiteDB;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

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
        private readonly DeviceProfileHandler _profile;
        
        public AtemClientExt(AtemClient client)
        {
            _profile = new DeviceProfileHandler();
            
            Client = client;
            Client.OnReceive += _profile.HandleCommands;
            Client.OnConnection += sender => { Connected = true; };
            Client.OnDisconnect += sender => { Connected = false; };
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
                SetupConnection(device);
                devices[device.Info.Id()] = device;
            }

            discovery = new AtemDiscoveryService();
            discovery.OnDeviceSeen += OnDeviceSeen;
            discovery.OnDeviceLost += OnDeviceLost;
        }

        private void SetupConnection(AtemDevice device)
        {
            if (device.Enabled && device.Client == null)
            {
                device.Client = new AtemClientExt(new AtemClient(device.Info.Address, false));
                // TODO setup listeners for stuff
                
                device.Client.Client.Connect();
            } else if (!device.Enabled && device.Client != null) {
                device.Client.Client.Dispose();
                device.Client = null;
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
