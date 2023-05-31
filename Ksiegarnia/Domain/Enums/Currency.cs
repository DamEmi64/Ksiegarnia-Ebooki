using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Domain.Enums
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum Currency
    {
        [JsonProperty("PLN")]
        PLN,
        [JsonProperty("EUR")]
        EUR,
        [JsonProperty("Token")]
        Token
    }
}
