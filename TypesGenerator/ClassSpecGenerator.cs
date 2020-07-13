using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using LibAtem;

namespace TypesGenerator
{
    public class ClassSpecGenerator
    {
        private readonly StreamWriter _file;
        private readonly HashSet<string> _generatedClasses;
        private readonly List<string> _pendingClasses;
        private readonly string _thisPrefix;
        private readonly Type _reference;
        
        public ClassSpecGenerator(StreamWriter file, string thisPrefix, Type reference)
        {
            _file = file;
            _generatedClasses = new HashSet<string>();
            _pendingClasses = new List<string>();
            _thisPrefix = thisPrefix;
            _reference = reference;
        }

        private string SafeName(string rawName)
        {
            if (rawName.StartsWith(_thisPrefix))
                rawName = rawName.Substring(_thisPrefix.Length);

            return rawName.Replace(".", "_").Replace("+", "_");
        }
        
        public void RunIt(string entry)
        {
            _file.WriteLine($"import * as Enums from './common-enums'");

            _pendingClasses.Add(entry);

            while (_pendingClasses.Count > 0)
            {
                var t = _pendingClasses[0];
                _pendingClasses.RemoveAt(0);
                if (_generatedClasses.Add(t))
                {
                    RunForClass(t);
                }
            }
        }

        private string translateType(Type t)
        {
            string commonPrefix = "LibAtem.Common.";

            bool isDictionary = t.IsGenericType && (t.GetGenericTypeDefinition() == typeof(Dictionary<,>) || t.GetGenericTypeDefinition() == typeof(IReadOnlyDictionary<,>));
            bool isList = t.IsGenericType && (t.GetGenericTypeDefinition() == typeof(List<>) || t.GetGenericTypeDefinition() == typeof(IReadOnlyList<>));

            if (isList)
            {
                return translateType(t.GetGenericArguments().Single()) + "[]";
            }

            if (isDictionary)
            {
                var types = t.GetGenericArguments();
                if (translateType(types[0]) != "unknown")
                {
                    return $"Record<{translateType(types[0])}, {translateType(types[1])}>"; // | undefined>"; // TODO - this is safer, but is it a good idea?   
                }
            }
            if (t.IsArray)
            {
                return translateType(t.GetElementType()) + "[]";
            }
            if (t.FullName.StartsWith(commonPrefix))
            {
                return "Enums." + t.FullName.Substring(commonPrefix.Length);
            }
            if (t.FullName.StartsWith(_thisPrefix))
            {
                _pendingClasses.Add(t.FullName);
                return SafeName(t.FullName);
            }
            if (t == typeof(uint) || t == typeof(int) || t == typeof(long) || t == typeof(ulong) || t == typeof(byte) || t == typeof(float) || t == typeof(double))
            {
                return "number";
            }
            if (t == typeof(bool))
            {
                return "boolean";
            }
            if (t == typeof(string))
            {
                return "string";
            }

            if (t == typeof(ProtocolVersion))
            {
                // return "Enums.ProtocolVersion";
            }

            return "unknown";
        }

        private void RunForClass(string fullname)
        {
            var coreAssembly = typeof(ProtocolVersion).GetTypeInfo().Assembly;
            var refAssembly = _reference.GetTypeInfo().Assembly;
            var t = refAssembly.GetType(fullname) ?? coreAssembly.GetType(fullname);
            if (t != null)
            {
                _file.WriteLine($"export interface {SafeName(fullname)} {{");
                
                var sampleClass = Activator.CreateInstance(t);

                foreach (PropertyInfo prop in t.GetProperties(
                    BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic))
                {
                    var name = prop.Name.ToUpper() == prop.Name
                        ? prop.Name.ToLower()
                        : Char.ToLowerInvariant(prop.Name[0]) + prop.Name.Substring(1);
                    var isOptional = !prop.PropertyType.IsValueType && prop.CanWrite &&
                                     (prop.GetSetMethod(true)?.IsPublic).GetValueOrDefault(false) &&
                                     prop.GetValue(sampleClass) == null && prop.PropertyType != typeof(string);
                    var optionalStr = isOptional ? "?" : "";
                    _file.WriteLine($"  {name}{optionalStr}: {translateType(prop.PropertyType)}");
                }

                _file.WriteLine($"}}\n");
            }
            else
            {
                _file.WriteLine($"export type {SafeName(fullname)} = unknown");
            }
        }
        
        
    }
}