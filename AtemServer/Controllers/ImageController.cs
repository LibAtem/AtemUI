using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using AtemServer.Services;
using LibAtem.Common;
using LibAtem.Net.DataTransfer;
using LibAtem.Util.Media;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace AtemServer.Controllers
{
    [Route("api/[controller]")]
    public class ImagesController : Controller
    {
        private readonly AtemRepository _repo;

        public ImagesController(AtemRepository repo)
        {
            _repo = repo;
        }
        
        [HttpGet]
        [Route("download/{deviceId}/{hash}")]
        public async Task<IActionResult> GetImage(string deviceId, string hash)
        {
            // TODO - quality/format selector
            
            var client = _repo.GetConnection(deviceId);
            if (client == null)
                return BadRequest("Device not found");
            
            AtemMediaCacheItem image = client.GetImage(hash.ToUpper());
            if (image == null)
                return NotFound();

            if (image.Job != null)
                await image.Completion.Task;

            if (image.Job != null || image.RawFrame == null)
                return Problem("Download was complete then not?");

            if (image.PreviewJpeg == null)
            {
                AtemFrame frame = image.RawFrame;
                
                // TODO - this makes a lot of assumptions about color space and resolution
                using Image image2 = Image.LoadPixelData<Rgba32>(frame.GetRGBA(ColourSpace.BT709), 1920, 1080);
                
                // TODO - is this a good resolution?
                image2.Mutate(x => x.Resize(640, 0));

                var outStream = new MemoryStream();
                await image2.SaveAsJpegAsync(outStream);
                
                image.PreviewJpeg = outStream.ToArray();
            }

            return File(image.PreviewJpeg, "image/jpeg");
        }
        
        
        public class ImageUploadeData
        {
            public string Image { get; set; }
            public string Name { get; set; }
        }

        private byte[] GetBytes(Image<Rgba32> image)
        {
            if (!image.TryGetSinglePixelSpan(out Span<Rgba32> span))
                throw new Exception("Failed to get image as converted byte array");
            
            return MemoryMarshal.AsBytes(span).ToArray();
        }

        [HttpPost]
        [Route("upload/{deviceId}/still/{stillId}")]
        public async Task<String> UploadStill(string deviceId, uint stillId, [FromBody] ImageUploadeData data)
        {
            AtemClientExt client = _repo.GetConnection(deviceId);
            if (client == null)
                throw new Exception("Device not found");

            if (data.Image == null || data.Name == null)
                throw new Exception("Missing image body");

            var resolution = VideoModeResolution._1080;
            var resolutionSize = resolution.GetSize();
            
            byte[] rawBytes = Convert.FromBase64String(data.Image);
            using Image<Rgba32> image = Image.Load(rawBytes);

            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new Size((int) resolutionSize.Item1, (int) resolutionSize.Item2),
                Mode = ResizeMode.Pad
            }));

            byte[] rgbaBytes = GetBytes(image);
            var frame = AtemFrame.FromRGBA(data.Name, rgbaBytes, ColourSpace.BT709); // TODO - colorspace

            var completion = new TaskCompletionSource<bool>();
            var job = new UploadMediaStillJob(stillId, frame,
                (success) =>
                {
                    Console.WriteLine("Still upload {0} completed with {1}", stillId, success);
                    completion.SetResult(success);
                });
            
            Console.WriteLine("Still upload {0} queued", stillId);
            client.Client.DataTransfer.QueueJob(job);

            // Wait for the upload before returning
            await completion.Task;

            // TOOD - report failure
            return "success";
        }

    }
}