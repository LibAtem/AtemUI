using System;
using System.IO;
using System.Linq;
using System.Xml.Serialization;
using LibAtem.Common;
using LibAtem.Util;

namespace TypesGenerator
{
    public class VideoModeInfoGenerator
    {
        private readonly StreamWriter _file;
        
        public VideoModeInfoGenerator(StreamWriter file)
        {
            _file = file;
        }
        
        public void RunIt()
        {
            _file.WriteLine($"import * as Enums from './common-enums'");
            _file.WriteLine($"import * as Types from './manual-types'");
            
            _file.WriteLine("export const VideoModeInfoSet: Types.IVideoModeInfoSet = {");
            
            Enum.GetValues(typeof(VideoMode)).OfType<VideoMode>().ForEach(mode =>
            {
                _file.WriteLine($"  [Enums.VideoMode.{mode.ToString()}]: {{");

                var name = mode.GetAttribute<VideoMode, XmlEnumAttribute>();
                _file.WriteLine($"    name: \"{name.Name}\",");

                var res = mode.GetAttribute<VideoMode, VideoModeResolutionAttribute>();
                var res2 = res.Resolution.GetAttribute<VideoModeResolution, SizeAttribute>();
                _file.WriteLine($"    width: {res2.Width},");
                _file.WriteLine($"    height: {res2.Height},");
                
                var rate = mode.GetAttribute<VideoMode, VideoModeRateAttribute>();
                _file.WriteLine($"    framerate: {rate.Rate},");
                
                _file.WriteLine("  },");
            });
            
            _file.WriteLine("}\n");
        }
    }
}