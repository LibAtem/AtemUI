using System.Collections.Generic;
using AtemServer.Hubs;
using LibAtem;
using LibAtem.DeviceProfile;
using LibAtem.Net;
using LibAtem.State;
using LibAtem.State.Builder;
using LibAtem.Util;
using Microsoft.AspNetCore.SignalR;

namespace AtemServer.Services
{
    public class AtemClientExt
    {
        private readonly string _deviceId;
        private readonly DeviceProfileHandler _profile;
        private readonly AtemState _state;
        private readonly IHubContext<DevicesHub> _context;
        private readonly HashSet<string> _subscriptions;
        private readonly AtemMediaCache _mediaCache;
        
        public delegate void DeviceChange(object sender);

        public event DeviceChange OnChange;

        public AtemClientExt(string deviceId, AtemClient client, IHubContext<DevicesHub> context, TransferJobMonitor transfers, HashSet<string> subscriptions)
        {
            _deviceId = deviceId;
            _profile = new DeviceProfileHandler();
            _subscriptions = subscriptions;
            _state = new AtemState();
            _context = context;
            _mediaCache = new AtemMediaCache(transfers);
            
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
                
                _mediaCache.EnsureMediaIsDownloaded(Client, newState);
            };


            Client.DataTransfer.OnJobStarted += (sender, job) => transfers.JobStarted(deviceId, job);
            Client.DataTransfer.OnJobQueued += (sender, job) => transfers.JobQueued(deviceId, job);
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
            _context.Clients.Clients(GetClientIds()).SendAsync("state", new AtemStateWrapped{
                State = state,
                DeviceId = _deviceId
            });
        }
        
        private void SendStateDiff(AtemState state, HashSet<string> paths/*Dictionary<string, object> diffs*/)
        {
            _context.Clients.Clients(GetClientIds()).SendAsync("stateDiff", new AtemStateDiff(){
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
            return _mediaCache.Get(hash);
        }

        public AtemClient Client { get; }
        
        public bool Connected { get; private set; }
        public string Version => Client?.ConnectionVersion?.ToVersionString();
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
}