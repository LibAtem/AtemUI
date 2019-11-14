using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

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

    }
}
