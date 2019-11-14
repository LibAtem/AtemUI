using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace AtemServer.Hubs
{
    public class DevicesHub : Hub
    {
        private readonly AtemRepository repo_;
        
        public DevicesHub(AtemRepository repo)
        {
            repo_ = repo;
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
            return SendDevices(repo_.ListDevices());
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
            return SendMutateResponse(repo_.AddDevice(address, port), "Add");
        }
        
        public Task DeviceForget(string address, int port)
        {
            return SendMutateResponse(repo_.ForgetDevice(address, port), "Forget");
        }
        
        public Task DeviceEnabled(string address, int port, bool enabled)
        {
            return SendMutateResponse(repo_.SetDeviceEnabled(address, port, enabled), "Enabled");
        }
        #endregion Devices
        
        public async Task NewMessage(long username, string message)
        {
            await Clients.All.SendAsync("messageReceived", username, message);
        }
    }
}