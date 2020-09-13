using System;
using LibAtem.Commands.MixEffects;
using LibAtem.Common;
using LibAtem.DeviceProfile;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
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
        
    }
}