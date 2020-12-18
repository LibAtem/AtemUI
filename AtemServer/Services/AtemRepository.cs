using System;
using System.Collections.Generic;
using System.Linq;
using AtemServer.Hubs;
using log4net;
using LibAtem.Net;
using LibAtem.Discovery;
using LibAtem.State;
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

namespace AtemServer.Services
{
    public class AtemRepository
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(AtemClient));

        private readonly LiteDatabase _db;
        private readonly ILiteCollection<AtemDevice> _dbDevices;
        private readonly Dictionary<string, AtemDevice> _devices;

        private readonly AtemDiscoveryService _discovery;
        private readonly IHubContext<DevicesHub> _context;
        private readonly TransferJobMonitor _transfers;

        static AtemRepository()
        {
            // Workaround due to AtemDeviceInfo not having property setters
            BsonMapper.Global.RegisterType<AtemDeviceInfo>
            (
                serialize: (info) => JsonConvert.SerializeObject(info),
                deserialize: (bson) => JsonConvert.DeserializeObject<AtemDeviceInfo>(bson.AsString)
            );
        }

        public AtemRepository(IHubContext<DevicesHub> context, TransferJobMonitor transfers)
        {
            _db = new LiteDatabase(@"MyData.db");
            _dbDevices = _db.GetCollection<AtemDevice>("devices");
            _devices = new Dictionary<string, AtemDevice>();

            _context = context;
            _transfers = transfers;

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
                device.Client = new AtemClientExt(device.Info.Id(), new AtemClient(device.Info.Address, false),
                    _context, _transfers, device.Subscriptions);
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
