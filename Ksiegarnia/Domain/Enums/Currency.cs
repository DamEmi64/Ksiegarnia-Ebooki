using Newtonsoft.Json.Converters;
using System.Text.Json.Serialization;

namespace Domain.Enums
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum Currency
    {
        PLN,
        EUR
    }
}
