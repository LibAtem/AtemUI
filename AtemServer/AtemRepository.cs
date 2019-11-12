using System;
using System.Collections.Generic;
using System.Linq;
using log4net;
using LibAtem.Net;
using LibAtem.Discovery;
using LiteDB;
using Newtonsoft.Json;

namespace AtemServer
{
    public class AtemDevice
    {
        public AtemDeviceInfo Info { get; set; }
        
        public bool Enabled { get; set; }
        
        public bool Remember { get; set; }

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
                var id = string.Format("{0}:{1}", device.Info.Address, device.Info.Port);
                devices[id] = device;
            }

            discovery = new AtemDiscoveryService();
            discovery.OnDeviceSeen += OnDeviceSeen;
            // discovery.OnDeviceLost += OnDeviceLost;
        }

        private void OnDeviceSeen(object sender, AtemDeviceInfo info)
        {
            // TODO - should this use deviceId?
            var id = string.Format("{0}:{1}", info.Address, info.Port);

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
                }
            }
            Console.WriteLine("Seen: " + info.ToString());

        }
        // private void OnDeviceLost(object sender, AtemDeviceInfo info) {
        //     Console.WriteLine("Seen: " + info.ToString());
        // }

        public List<AtemDevice> ListDevices()
        {
            lock (devices)
            {
                return devices.Select(d => d.Value).ToList();
            }
        }

        public bool AddDevice(string address, int port)
        {
            var id = string.Format("{0}:{1}", address, port);

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
                    
                    // TODO - startup connection
                    
                    return true;
                }

                return false;
            }
        }
        
        public bool ForgetDevice(string address, int port)
        {
            var id = string.Format("{0}:{1}", address, port);

            lock (devices)
            {
                dbDevices.Delete(id);
                return devices.Remove(id);
            }
        }
        
        public bool SetDeviceEnabled(string address, int port, bool enabled)
        {
            var id = string.Format("{0}:{1}", address, port);

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
                    return true;
                }

                return false;
            }
        }

    }
}
