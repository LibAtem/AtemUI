using LibAtem.Commands;
using LibAtem.DeviceProfile;
using LibAtem.Net.DataTransfer;
using LibAtem.State;
using LibAtem.Util.Media;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
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

        private static IReadOnlyDictionary<string, Type> typesMap;

        private static Type TranslateToType(string fullName)
        {
            if (typesMap == null)
            {
                var newTypesMap = new Dictionary<string, Type>();
                foreach (var commandSet in CommandManager.GetAllTypes())
                {
                    foreach (var (_, cmd) in commandSet.Value)
                    {
                        newTypesMap[cmd.FullName] = cmd;
                    }
                }

                typesMap = newTypesMap;
            }

            return typesMap.TryGetValue(fullName, out Type value) ? value : null;
        }

        public async Task CommandSend(string deviceId, string commandName, string propertiesStr)
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
            var client = repo_.GetConnection(deviceId);
            if (client == null)
            {
                throw new Exception("Bad deviceId");
            }

            client.Client.SendCommand(cmd);
            //updateLabel(deviceId);

        }


        public void updateLabel(string deviceId, string name, uint id)
        {
            var client = repo_.GetConnection(deviceId);
            if (client == null)
            {
                throw new Exception("Bad deviceId");
            }
            
            var job = new UploadMultiViewJob(id, AtemFrame.FromYCbCr(name, MultiViewImage.Make(name)), uploadResult);

            client.Client.DataTransfer.QueueJob(job);
        }

     /*   public void addImage(string deviceId, string name, uint id)
        {
            var client = repo_.GetConnection(deviceId);
            if (client == null)
            {
                throw new Exception("Bad deviceId");
            }

            var data = new byte[8294400];
            var img720 = new Bitmap(1920, 1080);
            Graphics drawing = Graphics.FromImage(img720);
            drawing.Clear(Color.Blue);

            for (int i = 0; i < img720.Width; i++)
            {
                for (int j = 0; j < img720.Height; j++)
                {
                    Color pixel = img720.GetPixel(i, j);
                    data[(i + (1920 * j)) * 4] = pixel.R;
                    data[(i + (1920 * j)) * 4+1] = pixel.G;
                    data[(i + (1920 * j)) * 4+2] = pixel.B;
                    data[(i + (1920 * j)) * 4+3] = pixel.A;

                }
            }
           var job = new UploadMediaStillJob(8, AtemFrame.FromRGBA(name, data,ColourSpace.BT709), uploadResult);

            client.Client.DataTransfer.QueueJob(job);
        }*/




        public void uploadResult(bool result)
        {
            //... do something
            Console.WriteLine("Sucess? {0}", result);
        }

        public Task<AtemState> StateGet(string deviceId)
        {
            var client = repo_.GetConnection(deviceId);
            if (client == null)
            {
                throw new Exception("Bad deviceId");
            }


            return Task.FromResult(client.GetState());
        }

        public async void SendState(string deviceId)
        {
            var client = repo_.GetConnection(deviceId);
            if (client == null)
            {
                throw new Exception("Bad deviceId");
            }

            await Clients.All.SendAsync("state", client.GetState());

        }

        public Task<DeviceProfile> SendProfile(string deviceId)
        {
            var client = repo_.GetConnection(deviceId);
            if (client == null)
            {
                throw new Exception("Bad deviceId");
            }

            return Task.FromResult(client.GetProfile());

        }

        public async Task NewMessage(long username, string message)
        {
            await Clients.All.SendAsync("messageReceived", username, message);
        }


    }
}