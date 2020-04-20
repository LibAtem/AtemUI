using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using LibAtem.Commands.MixEffects;
using LibAtem.Common;
using LibAtem.DeviceProfile;
using LibAtem.Net.DataTransfer;
using LibAtem.Util.Media;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Newtonsoft.Json;

namespace AtemServer.Controllers


{
       public class imageData
    {
        public string image { get; set; }
        public uint index { get; set; }
    }

    public class hashData
    {
        public string hash { get; set; }
    }

    [Route("api2/")]
    public class ImageConroller : Controller
    {
        private readonly AtemRepository _repo;

        //private readonly Lazy<CommandsSpec> _cachedSpec;

        public ImageConroller(AtemRepository repo)
        {
            _repo = repo;
            
            // Force the assembly to be loaded
            new MixEffectCutCommand();

            // TODO - refactor CompileData into this package
            //_cachedSpec = new Lazy<CommandsSpec>(() => SpecGenerator.CompileData());
        }
        
        [HttpPost]
        [Route("download/{id}")]
        public String Get(string id, [FromBody] hashData data)
        {
            if (data !=null)
            {
                var client = _repo.GetConnection(id);
                if (client == null)
                {
                    throw new Exception("Device not found");
                }
                /* client._images*/
                var image = client.GetImage(data.hash);
                if (image != null)
                {
                    if (image.Downloaded)
                    {
                        return image.Base64;
                    }
                    else
                    {
                        return "Not Downloaded";
                    }

                }
                else
                {
                    return "Not Present";
                }
            }
            return "No data";
        }

        [HttpPost]
        [Route("{id}/{name}")]
        public String Post(string id,string name, [FromBody] imageData data)
        {
    

           
            var client = _repo.GetConnection(id);
            if (client == null)
            {
                throw new Exception("Device not found");
            }

            if (data.image!=null)
            {
                string base64 = data.image.Split(',')[1];
                byte[] bytes = Convert.FromBase64String(base64);
                using (Bitmap image = (Bitmap)Image.FromStream(new MemoryStream(bytes)))
                {
                    int sourceWidth = image.Width;
                    int sourceHeight = image.Height;
                    int sourceX = 0;
                    int sourceY = 0;
                    int destX = 0;
                    int destY = 0;

                    int Width = 1920;
                    int Height = 1080;

                    float nPercent = 0;
                    float nPercentW = 0;
                    float nPercentH = 0;

                    nPercentW = ((float)Width / (float)sourceWidth);
                    nPercentH = ((float)Height / (float)sourceHeight);
                    if (nPercentH < nPercentW)
                    {
                        nPercent = nPercentH;
                        destX = System.Convert.ToInt16((Width -
                                      (sourceWidth * nPercent)) / 2);
                    }
                    else
                    {
                        nPercent = nPercentW;
                        destY = System.Convert.ToInt16((Height -
                                      (sourceHeight * nPercent)) / 2);
                    }

                    int destWidth = (int)(sourceWidth * nPercent);
                    int destHeight = (int)(sourceHeight * nPercent);

                    Bitmap bmPhoto = new Bitmap(Width, Height);
                    bmPhoto.SetResolution(image.HorizontalResolution,
                                     image.VerticalResolution);

                    Graphics grPhoto = Graphics.FromImage(bmPhoto);
                    grPhoto.Clear(Color.Black);
                    grPhoto.InterpolationMode =
                            InterpolationMode.HighQualityBicubic;

                    grPhoto.DrawImage(image,
                        new Rectangle(destX, destY, destWidth, destHeight),
                        new Rectangle(sourceX, sourceY, sourceWidth, sourceHeight),
                        GraphicsUnit.Pixel);


                    byte[] pixelData = new byte[1080 * 1920 * 4];
                    for (int j = 0; j < (1920 * 1080 * 4); j++)
                    {
                        pixelData[j] = 0;
                    }
                    for (int i = 0; i < bmPhoto.Width; i++)
                    {
                        for (int j = 0; j < bmPhoto.Height; j++)
                        {
                            Color pixel = bmPhoto.GetPixel(i, j);
                                pixelData[((i + (1920 * j)) * 4)] = pixel.R;
                                pixelData[((i + (1920 * j)) * 4) + 1] = pixel.G;
                                pixelData[((i + (1920 * j)) * 4) + 2] = pixel.B;
                                pixelData[((i + (1920 * j)) * 4) + 3] = pixel.A;
                            
                        }
                    }
                    grPhoto.Dispose();
                    image.Dispose();
                    var job = new UploadMediaStillJob(data.index, AtemFrame.FromRGBA(name, pixelData, ColourSpace.BT709), uploadResult);
                    Console.WriteLine("sending image");
                    client.Client.DataTransfer.QueueJob(job);
                    //image.Save("output.jpg", ImageFormat.Jpeg);  // Or Png
                }
            }


            return "success";
        }

        public void uploadResult(bool result)
        {
            
            //... do something
            Console.WriteLine("Sucess? {0}", result);
        }

        /*
        [HttpGet]
        public JsonResult Get()
        {
            //var profile = DeviceProfileRepository.GetSystemProfile(DeviceProfileType.Atem2ME4K);
            var profile = new DeviceProfile()
            {
                Model = ModelId.TwoME,
                Product = "Test",
                MixEffectBlocks = 2,
                ColorGenerators = 2,
                Auxiliaries = 6,
                DownstreamKeys = 2,
                UpstreamKeys = 2,
                RoutableKeyMasks = true,
                Stingers = 1,
                DVE = 1,
                SuperSource = 1,
                MediaPlayers = 1,
                MediaPoolClips = 2,
                MediaPoolStills = 32,
                MacroCount = 100,
                AudioMonitor = true,
                VideoModes = new VideoModeSet()
                {
                    SupportedModes = {},
                    /*DownConvertAbove = VideoModeStandard.SDI3G,
                    MaximumSupported = VideoModeStandard.SDI6G,
                    MinimumSupported = VideoModeStandard.SDISD,*\/
                    MaxFrames = new MaxFramesSet()
                    {
                        _720 = 1000,
                        _1080 = 500,
                        _4K = 200,
                        SD = 2000
                    }
                },
                Sources = {
                    new DevicePort
                    {
                        Id = VideoSource.Input1,
                        Port = {ExternalPortType.SDI}
                    },
                    new DevicePort
                    {
                        Id = VideoSource.Input2,
                        Port = {ExternalPortType.SDI}
                    },
                    new DevicePort
                    {
                        Id = VideoSource.Input3,
                        Port = {ExternalPortType.SDI}
                    },
                    new DevicePort
                    {
                        Id = VideoSource.Input4,
                        Port = {ExternalPortType.SDI}
                    },
                    new DevicePort
                    {
                        Id = VideoSource.Input5,
                        Port = {ExternalPortType.SDI}
                    }
                },
                MultiView = new MultiView
                {
                    CanRouteInputs = true,
                    CanSwapPreviewProgram = true,
                    CanToggleSafeArea = true,
                    Count = 2,
                    Supports1080p = true,
                    VuMeters = true
                }
            };

            var settings = JsonSerializerSettingsProvider.CreateSerializerSettings();
            settings.NullValueHandling = NullValueHandling.Ignore;
            
            return new JsonResult(SpecGenerator.CompileData(profile), settings);
        }*/
    }
}