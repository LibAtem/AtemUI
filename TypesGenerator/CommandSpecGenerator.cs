using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using LibAtem.Commands;
using LibAtem.Serialization;

namespace TypesGenerator
{
    public class CommandSpecGenerator
    {
        public static void RunIt(StreamWriter file)
        {
            var gen = new CommandSpecGenerator(file);
            gen.RunIt();
        }

        private readonly StreamWriter _file;
        
        private CommandSpecGenerator(StreamWriter file)
        {
            _file = file;
        }

        private static string SafeName(string rawName)
        {
            string prefix = "LibAtem.Commands.";
            if (rawName.StartsWith(prefix))
                rawName = rawName.Substring(prefix.Length);
            
            return rawName.Replace(".", "_");
        }

        private static string CompileProperty(string name, bool isOptional, string type)
        {
            // TODO - camelcase?
            var opt = isOptional ? "?" : "";
            return $"  {name}{opt}: {type}";
        }
        
        private void RunIt()
        {
            var funcs = new List<string>();
            var enumsSb = new StringBuilder();
            
            _file.WriteLine($"import * as Enums from './common-enums'");
            
            foreach (var cmdSet in CommandManager.GetAllTypes())
            {
                foreach (var cmd in cmdSet.Value)
                {
                    _file.WriteLine($"export interface {SafeName(cmd.Item2.FullName)} {{");
                    funcs.Add($"  [\"{cmd.Item2.FullName}\", {SafeName(cmd.Item2.FullName)}]");

                    if (typeof(SerializableCommandBase).GetTypeInfo().IsAssignableFrom(cmd.Item2))
                    {
                        var hasMask = cmd.Item2.GetProperties(
                                BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                            .Any(a => a.Name == "Mask");
                        
                        foreach (PropertyInfo prop in cmd.Item2.GetProperties(
                            BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic))
                        {
                            // If prop cannot be serialized, then ignore
                            if (!prop.CanWrite || prop.GetSetMethod() == null)
                                continue;

                            bool isOptional = hasMask && (!prop.GetCustomAttributes<CommandIdAttribute>().Any() || prop.Name == "Mask");

                            if (prop.GetCustomAttribute<BoolAttribute>() != null)
                            {
                                _file.WriteLine(CompileProperty(prop.Name, isOptional, "boolean"));
                            }
                            else if (prop.GetCustomAttribute<Enum8Attribute>() != null ||
                                     prop.GetCustomAttribute<Enum16Attribute>() != null ||
                                     prop.GetCustomAttribute<Enum32Attribute>() != null)
                            {
                                string commonPrefix = "LibAtem.Common.";
                                if (prop.PropertyType.FullName.StartsWith(commonPrefix))
                                {
                                    _file.WriteLine(CompileProperty(prop.Name, isOptional,
                                        "Enums." + SafeName(prop.PropertyType.FullName.Substring(commonPrefix.Length))));
                                }
                                else if (prop.Name == "Mask")
                                {
                                    string typeName = SafeName(cmd.Item2.FullName) + "_MaskFlags";
                                    _file.WriteLine(CompileProperty(prop.Name, isOptional, typeName));
                                    
                                    enumsSb.AppendLine($"export enum {typeName} {{");
                                    foreach (object val in Enum.GetValues(prop.PropertyType))
                                    {
                                        enumsSb.AppendLine($"  {val.ToString()} = {(int) val},");
                                    }
                                    enumsSb.AppendLine($"}}\n");
                                } else
                                {
                                    _file.WriteLine(CompileProperty(prop.Name, isOptional, "unknown"));
                                }
                            }
                            else if (prop.GetCustomAttribute<StringAttribute>() != null)
                            {
                                _file.WriteLine(CompileProperty(prop.Name, isOptional, "string"));
                            }
                            else if (prop.GetCustomAttribute<StringLengthAttribute>() != null)
                            {
                                _file.WriteLine(CompileProperty(prop.Name, isOptional, "string"));
                            }
                            else if (prop.GetCustomAttribute<ByteArrayAttribute>() != null)
                            {
                                _file.WriteLine(CompileProperty(prop.Name, isOptional, "number[]"));
                            }
                            else if (prop.GetCustomAttribute<UInt16ListAttribute>() != null)
                            {
                                _file.WriteLine(CompileProperty(prop.Name, isOptional, "number[]"));
                            }
                            else
                            {
                                _file.WriteLine(CompileProperty(prop.Name, isOptional, "number"));
                            }
                        }
                    }
                    else
                    {
                        _file.WriteLine($"  unimplemented: never");
                    }
                    // TODO
                    
                    _file.WriteLine($"}}\n");
                }
            }
            
            _file.Write(enumsSb);
            
            // Finish with the sb
            _file.WriteLine("export type CommandTypes =");
            _file.Write(string.Join(" |\n", funcs));
            _file.WriteLine(";");
        }
    }
}