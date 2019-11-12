using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Xml.Serialization;
using LibAtem.Commands;
using LibAtem.Common;
using LibAtem.DeviceProfile;
using LibAtem.MacroOperations;
using LibAtem.Serialization;

namespace AtemServer.Controllers
{
    public class CommandsSpec
    {
        public CommandsSpec()
        {
            this.Commands = new Dictionary<string, CommandSpec>();
        }
        
        public Dictionary<string, CommandSpec> Commands { get; set; }
        // TODO
    }

    public enum CommandPropertyType
    { // TODO - format as string
        Int,
        Double,
        Bool,
        Enum,
        Flags,
    }

    public class CommandSpec
    {
        public CommandSpec()
        {
            this.Properties = new List<CommandProperty>();
        }
        
        public string FullName { get; set; }
        public string Name { get; set; }
        
        public bool IsValid { get; set; }
        
        public List<CommandProperty> Properties { get; set; }
    }

    public class CommandProperty
    {
        public string Name { get; set; }
        public bool IsId { get; set; }
        
        public CommandPropertyType Type { get; set; }
        
        public int Min { get; set; }
        public int Max { get; set; }
        public double Scale { get; set; }
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

            foreach (var cmd in CommandManager.GetAllTypes())
            {
                var spec = res.Commands[cmd.Value.FullName] = new CommandSpec
                {
                    FullName = cmd.Value.FullName,
                    Name = cmd.Value.Name
                };

                if (typeof(SerializableCommandBase).GetTypeInfo().IsAssignableFrom(cmd.Value))
                {
                    spec.IsValid = true;

                    foreach (PropertyInfo prop in cmd.Value.GetProperties(
                        BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic))
                    {
                        // If prop cannot be deserialized, then ignore
                        if (!prop.CanWrite || prop.GetSetMethod() == null)
                            continue;

                        if (prop.GetCustomAttribute<NoSerializeAttribute>() != null)
                            continue;
                        
                        //TODO
                        var resProp = new CommandProperty
                        {
                            Name = prop.Name,
                            IsId = prop.GetCustomAttributes<CommandIdAttribute>().Any()
                        };
                        
                        if (prop.GetCustomAttribute<BoolAttribute>() != null)
                        {
                            resProp.Type = CommandPropertyType.Bool;
                        }
                        else if (prop.GetCustomAttribute<Enum8Attribute>() != null || prop.GetCustomAttribute<Enum16Attribute>() != null || prop.GetCustomAttribute<Enum32Attribute>() != null)
                        {
                            resProp.Type = prop.PropertyType.GetCustomAttribute<FlagsAttribute>() != null ? CommandPropertyType.Flags : CommandPropertyType.Enum;

                           /* string mappedTypeName = TypeMappings.MapType(prop.PropertyType.FullName);
                            Type mappedType = prop.PropertyType;
                            if (mappedTypeName != mappedType.FullName && mappedTypeName.IndexOf("System.") != 0)
                                mappedType = GetType(mappedTypeName);


                            foreach (object val in Enum.GetValues(mappedType))
                            {
                                string id = val.ToString();
                                var xmlAttr = mappedType.GetMember(val.ToString())[0].GetCustomAttribute<XmlEnumAttribute>();
                                if (xmlAttr != null)
                                    id = xmlAttr.Name;

                                if (!AvailabilityChecker.IsAvailable(profile, val))
                                    continue;

                                // TODO check value is available for usage location
                                xmlField.Values.Add(new MacroFieldValueSpec()
                                {
                                    Id = id,
                                    Name = val.ToString(),
                                });
                            }*/
                        }
                        else
                        {
                            SetNumericProps(profile, cmd.Value, resProp, prop);
                        }
                        
                        spec.Properties.Add(resProp);
                    }
                }
                /*
                var xmlOp = new MacroOperationSpec() {Id = op.Key.ToString()};
                res.Operations.Add(xmlOp);
                
                IEnumerable<PropertyInfo> props = op.Value.GetProperties(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                    .Where(prop => prop.GetCustomAttribute<NoSerializeAttribute>() == null)
                    .OrderBy(prop => prop.GetCustomAttribute<SerializeAttribute>()?.StartByte ?? 999);

                foreach (PropertyInfo prop in props)
                {
                    var fieldAttr = prop.GetCustomAttribute<MacroFieldAttribute>();
                    if (fieldAttr == null)
                        continue;

                    var xmlField = new MacroFieldSpec()
                    {
                        Id = fieldAttr.Id,
                        Name = fieldAttr.Name,
                        IsId = prop.GetCustomAttribute<CommandIdAttribute>() != null
                    };
                    xmlOp.Fields.Add(xmlField);

                    if (prop.GetCustomAttribute<BoolAttribute>() != null)
                    {
                        xmlField.Type = MacroFieldType.Bool;
                    }
                    else if (prop.GetCustomAttribute<Enum8Attribute>() != null || prop.GetCustomAttribute<Enum16Attribute>() != null || prop.GetCustomAttribute<Enum32Attribute>() != null)
                    {
                        xmlField.Type = prop.PropertyType.GetCustomAttribute<FlagsAttribute>() != null ? MacroFieldType.Flags : MacroFieldType.Enum;

                        string mappedTypeName = TypeMappings.MapType(prop.PropertyType.FullName);
                        Type mappedType = prop.PropertyType;
                        if (mappedTypeName != mappedType.FullName && mappedTypeName.IndexOf("System.") != 0)
                            mappedType = GetType(mappedTypeName);


                        foreach (object val in Enum.GetValues(mappedType))
                        {
                            string id = val.ToString();
                            var xmlAttr = mappedType.GetMember(val.ToString())[0].GetCustomAttribute<XmlEnumAttribute>();
                            if (xmlAttr != null)
                                id = xmlAttr.Name;

                            if (!AvailabilityChecker.IsAvailable(profile, val))
                                continue;

                            // TODO check value is available for usage location
                            xmlField.Values.Add(new MacroFieldValueSpec()
                            {
                                Id = id,
                                Name = val.ToString(),
                            });
                        }
                    }
                    else
                    {
                        SetNumericProps(profile, op.Key, xmlField, prop);
                    }
                }*/
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

            throw new Exception(string.Format("Unknown field type: {0}.{1}", field.Name, prop.Name));
        }

        private static T GetDefaultForField<T>(DeviceProfile profile, Type cmdType, CommandProperty field)
        {
            return (T) AvailabilityChecker.GetMaxForCommandProperty(profile, string.Format("{0}.{1}", cmdType.Name, field.Name));
        }
    }
}
