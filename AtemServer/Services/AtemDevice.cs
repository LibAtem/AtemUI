using System.Collections.Generic;
using LibAtem.Discovery;
using LiteDB;
using Newtonsoft.Json;

namespace AtemServer.Services
{
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
}