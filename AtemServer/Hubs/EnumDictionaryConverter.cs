using System;
using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace AtemServer.Hubs
{
    public class EnumDictionaryConverter : JsonConverter
    {
        private static IEnumerable<KeyValuePair<object?, object?>> Zip(ICollection first, ICollection second)
        {
            IEnumerator firstEnumerator = first.GetEnumerator();
            IEnumerator secondEnumerator = second.GetEnumerator();

            while (firstEnumerator.MoveNext())
            {
                if (secondEnumerator.MoveNext())
                {
                    yield return new KeyValuePair<object?, object?>(firstEnumerator.Current, secondEnumerator.Current);
                }
            }
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            var dictionary = (IDictionary) value;
            
            writer.WriteStartObject();

            var keys = dictionary.Keys;
            var vals = dictionary.Values;

            foreach (var pair in Zip(keys, vals))
            {
                writer.WritePropertyName(((int)pair.Key).ToString());
                JToken.FromObject(pair.Value, serializer).WriteTo(writer);
            }

            writer.WriteEndObject();
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {/*
            var jObject = JObject.Load(reader);

            var maleValue = int.Parse(jObject[((int) Gender.Male).ToString()].ToString());
            var femaleValue = int.Parse(jObject[((int)Gender.Female).ToString()].ToString());

            (existingValue as Dictionary<Gender, int>).Add(Gender.Male, maleValue);
            (existingValue as Dictionary<Gender, int>).Add(Gender.Female, femaleValue);

            return existingValue;
            */
            throw new NotImplementedException();
        }

        public override bool CanConvert(Type objectType)
        {
            bool isDictionary = objectType.IsGenericType && objectType.GetGenericTypeDefinition() == typeof(Dictionary<,>);
            if (isDictionary)
            {
                var args = objectType.GetGenericArguments();
                if (args[0].IsEnum)
                {
                    return true;
                }
            }

            return false;
        }
    }
}