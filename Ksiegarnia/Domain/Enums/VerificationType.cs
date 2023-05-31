using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Domain.Enums
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum VerificationType
    {
        [JsonProperty("Verifing")]
        Verifing,
        [JsonProperty("Accepted")]
        Accepted,
        [JsonProperty("Rejected")]
        Rejected
    }
}
