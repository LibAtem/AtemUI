using System;
using LibAtem.Commands.MixEffects;
using LibAtem.Common;
using LibAtem.DeviceProfile;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Newtonsoft.Json;

namespace AtemServer.Controllers
{
    [Route("api/[controller]")]
    public class SpecController : Controller
    {
        private readonly AtemRepository _repo;

        //private readonly Lazy<CommandsSpec> _cachedSpec;

        public SpecController(AtemRepository repo)
        {
            _repo = repo;
            
            // Force the assembly to be loaded
            new MixEffectCutCommand();

            // TODO - refactor CompileData into this package
            //_cachedSpec = new Lazy<CommandsSpec>(() => SpecGenerator.CompileData());
        }
        
        [HttpGet]
        [Route("{id}")]
        public JsonResult Get(string id)
        {
            var client = _repo.GetConnection(id);
            if (client == null)
            {
                throw new Exception("Device not found");
            }
            
            var settings = JsonSerializerSettingsProvider.CreateSerializerSettings();
            settings.NullValueHandling = NullValueHandling.Ignore;
            
            return new JsonResult(SpecGenerator.CompileData(client.Profile), settings);
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