using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using LibAtem;
using LibAtem.Commands;
using LibAtem.DeviceProfile;
using LibAtem.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace AtemServer.Controllers
{
    public class CommandsSpec
    {
        public CommandsSpec()
        {
            this.Commands = new Dictionary<string, CommandSpec>();
        }
        
        public Dictionary<string, CommandSpec> Commands { get; }
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum CommandPropertyType
    {
        Int,
        Double,
        Bool,
        Enum,
        Flags,
        String,
        ByteArray,
        IntArray,
        Timestamp,
        IpAddress,
    }

    public class CommandSpec
    {
        public CommandSpec()
        {
            this.Properties = new List<CommandProperty>();
        }
        
        public string FullName { get; set; }
        public string Name { get; set; }
        
        public ProtocolVersion? InitialVersion { get; set; }
        
        public bool ToServer { get; set; }
        public bool ToClient { get; set; }
        
        public bool IsValid { get; set; }
        
        public List<CommandProperty> Properties { get; }
    }

    public class CommandEnumOption
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class CommandProperty
    {
        public string Name { get; set; }
        public bool IsId { get; set; }
        
        public CommandPropertyType Type { get; set; }
        
        public long? Min { get; set; }
        public long? Max { get; set; }
        public double? Scale { get; set; }
        
        public IReadOnlyList<CommandEnumOption> Options { get; set; }
    }
    
    public class SpecGenerator
    {
        public static Type GetType(string typeName)
        {
            var type = Type.GetType(typeName);
            if (type != null) return type;
            foreach (var a in AppDomain.CurrentDomain.GetAssemblies())
            {
                type = a.GetType(typeName);
                if (type != null)
                    return type;
            }
            return null;
        }

        public static CommandsSpec CompileData(DeviceProfile profile)
        {
            var res = new CommandsSpec();

            foreach (var cmdSet in CommandManager.GetAllTypes())
            {
                foreach (var cmd in cmdSet.Value)
                {
                    var spec = res.Commands[cmd.Item2.FullName] = new CommandSpec
                    {
                        FullName = cmd.Item2.FullName,
                        Name = cmd.Item2.Name,
                        InitialVersion = cmd.Item1,
                        ToServer = false,
                        ToClient = false
                    };
                    
                    var nameAttr = cmd.Item2.GetCustomAttribute<CommandNameAttribute>();
                    if (nameAttr != null)
                    {
                        spec.ToClient = nameAttr.Direction.HasFlag(CommandDirection.ToClient);
                        spec.ToServer = nameAttr.Direction.HasFlag(CommandDirection.ToServer);
                    }

                    if (typeof(SerializableCommandBase).GetTypeInfo().IsAssignableFrom(cmd.Item2))
                    {
                        spec.IsValid = true;

                        foreach (PropertyInfo prop in cmd.Item2.GetProperties(
                            BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic))
                        {
                            // If prop cannot be serialized, then ignore
                            if (!prop.CanWrite || prop.GetSetMethod() == null)
                                continue;

                            if (prop.GetCustomAttribute<NoSerializeAttribute>() != null)
                                continue;

                            var resProp = new CommandProperty
                            {
                                Name = prop.Name,
                                IsId = prop.GetCustomAttributes<CommandIdAttribute>().Any()
                            };

                            if (prop.GetCustomAttribute<BoolAttribute>() != null)
                            {
                                resProp.Type = CommandPropertyType.Bool;
                            }
                            else if (prop.GetCustomAttribute<Enum8Attribute>() != null ||
                                     prop.GetCustomAttribute<Enum16Attribute>() != null ||
                                     prop.GetCustomAttribute<Enum32Attribute>() != null)
                            {
                                resProp.Type = prop.PropertyType.GetCustomAttribute<FlagsAttribute>() != null
                                    ? CommandPropertyType.Flags
                                    : CommandPropertyType.Enum;
                                
                                 var options = new List<CommandEnumOption>();
                                 foreach (object val in Enum.GetValues(prop.PropertyType))
                                 {
                                     if (!AvailabilityChecker.IsAvailable(profile, val))
                                         continue;
     
                                     // TODO check value is available for usage location
                                     options.Add(new CommandEnumOption
                                     {
                                         Id = (int) val,
                                         Name = val.ToString(),
                                     });
                                 }

                                 resProp.Options = options;
                            }
                            else if (prop.GetCustomAttribute<StringAttribute>() != null)
                            {
                                resProp.Type = CommandPropertyType.String;
                            }
                            else if (prop.GetCustomAttribute<StringLengthAttribute>() != null)
                            {
                                resProp.Type = CommandPropertyType.String;
                                resProp.Max = (int) prop.GetCustomAttribute<StringLengthAttribute>().MaxLength;
                            }
                            else if (prop.GetCustomAttribute<ByteArrayAttribute>() != null)
                            {
                                resProp.Type = CommandPropertyType.ByteArray;
                                resProp.Max = (int) prop.GetCustomAttribute<ByteArrayAttribute>().Size;
                            }
                            else if (prop.GetCustomAttribute<UInt16ListAttribute>() != null)
                            {
                                resProp.Type = CommandPropertyType.IntArray;
                                //resProp.Count = (int)prop.GetCustomAttribute<UInt16ListAttribute>().Count;
                            }
                            else if (prop.GetCustomAttribute<UInt32ListAttribute>() != null)
                            {
                                resProp.Type = CommandPropertyType.IntArray;
                                //resProp.Count = (int)prop.GetCustomAttribute<UInt32ListAttribute>().Count;
                            }
                            else if (prop.GetCustomAttribute<HyperDeckTimeAttribute>() != null)
                            {
                                resProp.Type = CommandPropertyType.Timestamp;
                            }
                            else if (prop.GetCustomAttribute<IpAddressAttribute>() != null)
                            {
                                resProp.Type = CommandPropertyType.IpAddress;
                            }
                            else
                            {
                                SetNumericProps(profile, cmd.Item2, resProp, prop);
                            }

                            spec.Properties.Add(resProp);
                        }
                    }
                }
            }

            return res;
        }

        private static void SetNumericProps(DeviceProfile profile, Type cmdType, CommandProperty field, PropertyInfo prop)
        {
            var uint16range = prop.GetCustomAttribute<UInt16RangeAttribute>();
            if (uint16range != null)
            {
                field.Type = CommandPropertyType.Int;
                field.Min = uint16range.Min;
                field.Max = uint16range.Max;
                return;
            }
            var uint8range = prop.GetCustomAttribute<UInt8RangeAttribute>();
            if (uint8range != null)
            {
                field.Type = CommandPropertyType.Int;
                field.Min = uint8range.Min;
                field.Max = uint8range.Max;
                return;
            }

            var uint32range = prop.GetCustomAttribute<UInt32RangeAttribute>();
            if (uint32range != null)
            {
                field.Type = CommandPropertyType.Int;
                field.Min = uint32range.Min;
                field.Max = uint32range.Max;
                return;
            }

            var uint16d = prop.GetCustomAttribute<UInt16DAttribute>();
            if (uint16d != null)
            {
                field.Type = CommandPropertyType.Double;
                field.Min = (int) uint16d.ScaledMin;
                field.Max = (int) uint16d.ScaledMax;
                field.Scale = uint16d.Scale;
                return;
            }
            var int16d = prop.GetCustomAttribute<Int16DAttribute>();
            if (int16d != null)
            {
                field.Type = CommandPropertyType.Double;
                field.Min = int16d.ScaledMin;
                field.Max = int16d.ScaledMax;
                field.Scale = int16d.Scale;
                return;
            }
            var int32d = prop.GetCustomAttribute<Int32DAttribute>();
            if (int32d != null)
            {
                field.Type = CommandPropertyType.Double;
                field.Min = int32d.ScaledMin;
                field.Max = int32d.ScaledMax;
                field.Scale = int32d.Scale;
                return;
            }

            var uint32d = prop.GetCustomAttribute<UInt32DAttribute>();
            if (uint32d != null)
            {
                field.Type = CommandPropertyType.Double;
                field.Min = (int)uint32d.ScaledMin;
                field.Max = (int)uint32d.ScaledMax;
                field.Scale = uint32d.Scale;
                return;
            }
            var uint16 = prop.GetCustomAttribute<UInt16Attribute>();
            if (uint16 != null)
            {
                field.Type = CommandPropertyType.Int;
                field.Min = 0;
                field.Max = (int) (GetDefaultForField<uint?>(profile, cmdType, field) ?? (uint) Math.Pow(2, 16) - 1);
                return;
            }
            var uint8 = prop.GetCustomAttribute<UInt8Attribute>();
            if (uint8 != null)
            {
                field.Type = CommandPropertyType.Int;
                field.Min = 0;
                field.Max = (int) (GetDefaultForField<uint?>(profile, cmdType, field) ?? (uint) Math.Pow(2, 8) - 1);
                return;
            }
            var uint32 = prop.GetCustomAttribute<UInt32Attribute>();
            if (uint32 != null)
            {
                field.Type = CommandPropertyType.Int;
                field.Min = 0;
                field.Max = (long) UInt32.MaxValue;
                return;
            }
            var int16 = prop.GetCustomAttribute<Int16Attribute>();
            if (int16 != null)
            {
                field.Type = CommandPropertyType.Int;
                field.Min = Int16.MinValue;
                field.Max = Int16.MaxValue;
                return;
            }

            var int32 = prop.GetCustomAttribute<Int32Attribute>();
            if (int32 != null)
            {
                field.Type = CommandPropertyType.Int;
                field.Min = Int32.MinValue;
                field.Max = Int32.MaxValue;
                return;
            }
            var dint32 = prop.GetCustomAttribute<DirectionInt32Attribute>();
            if (dint32 != null)
            {
                field.Type = CommandPropertyType.Int;
                field.Min = Int32.MinValue;
                field.Max = Int32.MaxValue;
                return;
            }
            var int64 = prop.GetCustomAttribute<Int64Attribute>();
            if (int64 != null)
            {
                field.Type = CommandPropertyType.Int;
                field.Min = Int32.MinValue;
                field.Max = Int32.MaxValue;
                //Fix this
                return;
            }


            throw new Exception(string.Format("Unknown field type: {0}.{1} in {2}", field.Name, prop.Name, cmdType.Name));
        }

        private static T GetDefaultForField<T>(DeviceProfile profile, Type cmdType, CommandProperty field)
        {
            return (T) AvailabilityChecker.GetMaxForCommandProperty(profile, $"{cmdType.Name}.{field.Name}");
        }
    }
}
