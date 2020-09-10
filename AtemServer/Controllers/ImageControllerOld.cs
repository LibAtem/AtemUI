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
    public class ImageConrollerOld : Controller
    {
        private readonly AtemRepository _repo;

        //private readonly Lazy<CommandsSpec> _cachedSpec;

        public ImageConrollerOld(AtemRepository repo)
        {
            _repo = repo;
            
            // Force the assembly to be loaded
            new MixEffectCutCommand();

            // TODO - refactor CompileData into this package
            //_cachedSpec = new Lazy<CommandsSpec>(() => SpecGenerator.CompileData());
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

    }
}