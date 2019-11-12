using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LibAtem.Discovery;

namespace AtemServer.Controllers
{
    [Route("api/[controller]")]
    public class DevicesController : Controller
    {
        private readonly AtemRepository _repo;

        public DevicesController(AtemRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public IEnumerable<AtemDevice> List()
        {
            return _repo.ListDevices();
        }

        public class ConnectionDetailsBody
        {
            public string Address { get; set; }
            public int? Port { get; set; }
        }
        
        [HttpPost]
        public string Add([FromBody] ConnectionDetailsBody body)
        {
            if (string.IsNullOrEmpty(body.Address) || !body.Port.HasValue)
                throw new Exception("Missing required parameter");

            // Ignore failure, as no harm done
            _repo.AddDevice(body.Address, body.Port.Value);
            
            return string.Format("{0}:{1}", body.Address, body.Port);
        }
        
        [HttpDelete]
        public string Delete([FromBody] ConnectionDetailsBody body)
        {
            if (string.IsNullOrEmpty(body.Address) || !body.Port.HasValue)
                throw new Exception("Missing required parameter");

            return _repo.ForgetDevice(body.Address, body.Port.Value) ? "ok" : "not found";
        }
        
        [HttpPost]
        [Route("enable")]
        public string Enable([FromBody] ConnectionDetailsBody body)
        {
            if (string.IsNullOrEmpty(body.Address) || !body.Port.HasValue)
                throw new Exception("Missing required parameter");

            return _repo.SetDeviceEnabled(body.Address, body.Port.Value, true) ? "ok" : "not found";
        }
        
        [HttpPost]
        [Route("disable")]
        public string Disable([FromBody] ConnectionDetailsBody body)
        {
            if (string.IsNullOrEmpty(body.Address) || !body.Port.HasValue)
                throw new Exception("Missing required parameter");

            return _repo.SetDeviceEnabled(body.Address, body.Port.Value, false) ? "ok" : "not found";
        }

    }
}
