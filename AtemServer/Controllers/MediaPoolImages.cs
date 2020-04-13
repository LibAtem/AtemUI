using System;
using System.Collections.Generic;
using System.Text;

namespace AtemServer.Controllers
{

    public class MediaPoolImage
    {

        public string Base64 { get; set; }
        public byte[] Hash { get; set; }
        public Boolean Downloaded { get; set; }

    }
}

