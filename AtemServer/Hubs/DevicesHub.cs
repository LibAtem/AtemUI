using LibAtem.Commands;
using LibAtem.DeviceProfile;
using LibAtem.Net.DataTransfer;
using LibAtem.State;
using LibAtem.Util.Media;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AtemServer.Hubs
{
    public class DevicesHub : Hub
    {
        private readonly AtemRepository _repo;

        public DevicesHub(AtemRepository repo)
        {
            _repo = repo;
        }
        
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            //await Groups.RemoveFromGroupAsync(Context.ConnectionId, "SignalR Users");
            _repo.DisconnectClient(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public override async Task OnConnectedAsync()
        {
            await DeviceList();
        }

        #region Devices
        private Task SendDevices(IReadOnlyList<AtemDevice> devices)
        {
            return Clients.Caller.SendAsync("devices", devices);
        }

        public Task DeviceList()
        {
            return SendDevices(_repo.ListDevices());
        }

        private async Task SendMutateResponse(Tuple<bool, IReadOnlyList<AtemDevice>> res, string msg)
        {
            if (!res.Item1)
            {
                // TODO - report failure
            }
            else
            {
                await DeviceList();
            }
        }

        public Task DeviceAdd(string address, int port)
        {
            return SendMutateResponse(_repo.AddDevice(address, port), "Add");
        }

        public Task DeviceForget(string address, int port)
        {
            return SendMutateResponse(_repo.ForgetDevice(address, port), "Forget");
        }

        public Task DeviceEnabled(string address, int port, bool enabled)
        {
            return SendMutateResponse(_repo.SetDeviceEnabled(address, port, enabled), "Enabled");
        }
        #endregion Devices

        private static IReadOnlyDictionary<string, Type> _commandTypesMap;

        private static Type TranslateToType(string fullName)
        {
            if (_commandTypesMap == null)
            {
                var newTypesMap = new Dictionary<string, Type>();
                foreach (var commandSet in CommandManager.GetAllTypes())
                {
                    foreach (var (_, cmd) in commandSet.Value)
                    {
                        newTypesMap[cmd.FullName] = cmd;
                    }
                }

                _commandTypesMap = newTypesMap;
            }

            return _commandTypesMap.TryGetValue(fullName, out Type value) ? value : null;
        }

        public void CommandSend(string deviceId, string commandName, string propertiesStr)
        {

            Console.WriteLine("Attempting to send {0} to {1} ({2})", commandName, deviceId, propertiesStr);
            // TODO
            //return SendMutateResponse(repo_.AddDevice(address, port), "Add");
            Type type = TranslateToType(commandName);
            if (type == null)
            {
                throw new Exception("Bad type");
            }

            ICommand cmd = (ICommand)JsonConvert.DeserializeObject(propertiesStr, type);
            Console.WriteLine("Got obj {0}", cmd);

            // Now try to send this command
            var client = _repo.GetConnection(deviceId);
            if (client == null)
            {
                throw new Exception("Bad deviceId");
            }

            client.Client.SendCommand(cmd);
            //updateLabel(deviceId);
        }

        public void updateLabel(string deviceId, string name, uint id)
        {
            var client = _repo.GetConnection(deviceId);
            if (client == null)
            {
                throw new Exception("Bad deviceId");
            }
            
            var job = new UploadMultiViewJob(id, AtemFrame.FromYCbCr(name, MultiViewImage.Make(name)), uploadResult);

            client.Client.DataTransfer.QueueJob(job);
        }

        public void uploadResult(bool result)
        {
            //... do something
            Console.WriteLine("Sucess? {0}", result);
        }

        public AtemState SubscribeState(string deviceId)
        {
            return _repo.SubscribeClient(Context.ConnectionId, deviceId);
        }
        
        public void UnsubscribeState(string deviceId)
        {
            _repo.UnsubscribeClient(Context.ConnectionId, deviceId);
        }

        public DeviceProfile SendProfile(string deviceId)
        {
            var client = _repo.GetConnection(deviceId);
            if (client == null)
            {
                throw new Exception("Bad deviceId");
            }

            return client.GetProfile();
        }

    }
}