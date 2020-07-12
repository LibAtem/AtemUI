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

        private static string SafeName(string rawName)
        {
            return rawName.Replace(".", "_");
        }
        
        private void RunIt()
        {
            string prefix = "LibAtem.Common.";
            var assembly = typeof(ProtocolVersion).GetTypeInfo().Assembly;
            foreach (Type type in assembly.GetTypes())
            {
                if (!type.GetTypeInfo().IsEnum) continue;
                if (!type.FullName.StartsWith(prefix)) continue;
                
                _file.WriteLine($"export enum {SafeName(type.FullName.Substring(prefix.Length))} {{");
                foreach (object val in Enum.GetValues(type))
                {
                    _file.WriteLine($"  {val.ToString()} = {(int) val},");
                }
                _file.WriteLine($"}}\n");
                
            }
        }
    }
}