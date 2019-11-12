using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using log4net;
using LibAtem.Net;
using LibAtem.Discovery;
using LiteDB;
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
    public class AtemDevice
    {
        public AtemDeviceInfo Info { get; set; }
        
        public bool Enabled { get; set; }
        
        public bool Remember { get; set; }
        
        [BsonIgnore]
        [JsonIgnore]
        public AtemClient Client { get; set; }

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

        static AtemRepository()
        {
            // Workaround due to AtemDeviceInfo not having property setters
            BsonMapper.Global.RegisterType<AtemDeviceInfo>
            (
                serialize: (info) => JsonConvert.SerializeObject(info),
                deserialize: (bson) => JsonConvert.DeserializeObject<AtemDeviceInfo>(bson.AsString)
            );
        }

        public AtemRepository()
        {
            db = new LiteDatabase(@"MyData.db");
            dbDevices = db.GetCollection<AtemDevice>("devices");
            devices = new Dictionary<string, AtemDevice>();

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
                device.Client = new AtemClient(device.Info.Address);
                // TODO setup listeners for stuff
            } else if (!device.Enabled && device.Client != null) {
                device.Client.Dispose();
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
                }
            }
        }

        public List<AtemDevice> ListDevices()
        {
            lock (devices)
            {
                return devices.Select(d => d.Value).ToList();
            }
        }
        
        public AtemClient GetConnection(string id)
        {
            lock (devices)
            {
                return devices[id]?.Client;
            }
        }

        public bool AddDevice(string address, int port)
        {
            var id = AtemDeviceExt.Id(address, port);

            lock (devices)
            {
                if (!devices.TryGetValue(id, out AtemDevice device))
                {
                    var doc = devices[id] = new AtemDevice(new AtemDeviceInfo(id, "", DateTime.MinValue, address, port, new List<string>()))
                    {
                        Remember = true, // Remember anything created manually
                        Enabled = true, // Enable for connections 
                    };

                    dbDevices.Upsert(id, doc);
                    
                    // startup connection
                    SetupConnection(doc);
                    
                    return true;
                }

                return false;
            }
        }
        
        public bool ForgetDevice(string address, int port)
        {
            var id = AtemDeviceExt.Id(address, port);

            lock (devices)
            {
                if (devices.TryGetValue(id, out AtemDevice device))
                {
                    // shutdown the connection
                    device.Enabled = false;
                    SetupConnection(device);
                    
                    dbDevices.Delete(id);
                    return devices.Remove(id);
                }
            }

            return false;
        }
        
        public bool SetDeviceEnabled(string address, int port, bool enabled)
        {
            var id = AtemDeviceExt.Id(address, port);

            lock (devices)
            {
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
                    return true;
                }

                return false;
            }
        }

    }
}
