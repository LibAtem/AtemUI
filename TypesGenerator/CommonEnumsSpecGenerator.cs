using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using LibAtem;
using LibAtem.Commands;
using LibAtem.Serialization;

namespace TypesGenerator
{
    public class CommonEnumsSpecGenerator
    {
        public static void RunIt(StreamWriter file)
        {
            var gen = new CommonEnumsSpecGenerator(file);
            gen.RunIt();
        }

        private readonly StreamWriter _file;
        
        private CommonEnumsSpecGenerator(StreamWriter file)
        {
            _file = file;
        }
        
        private static string simplePrefix = "LibAtem.";
        private static string prefix = "LibAtem.Common.";

        private static string SafeName(string rawName)
        {
            if (rawName.StartsWith(prefix))
            {
                rawName = rawName.Substring(prefix.Length);
            }
            if (rawName.StartsWith(simplePrefix))
            {
                rawName = rawName.Substring(simplePrefix.Length);
            }
            
            return rawName.Replace(".", "_");
        }
        
        private void RunIt()
        {
            ProcessEnum(typeof(ProtocolVersion));
                
            var assembly = typeof(ProtocolVersion).GetTypeInfo().Assembly;
            foreach (Type type in assembly.GetTypes())
            {
                if (!type.GetTypeInfo().IsEnum) continue;
                if (!type.FullName.StartsWith(prefix)) continue;

                ProcessEnum(type);
            }
        }

        private void ProcessEnum(Type type)
        {
            _file.WriteLine($"export enum {SafeName(type.FullName)} {{");
            foreach (object val in Enum.GetValues(type).OfType<object>().Distinct<object>())
            {
                _file.WriteLine($"  {val.ToString()} = {(int) val},");
            }
            _file.WriteLine($"}}\n");
        }
    }
}