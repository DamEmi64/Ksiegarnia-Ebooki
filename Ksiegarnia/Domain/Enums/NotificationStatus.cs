using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Domain.Enums
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum NotificationStatus
    {
        [JsonProperty("Reported")]
        Reported,
        [JsonProperty("Accepted")]
        Accepted,
        [JsonProperty("Abandoned")]
        Abandoned,
        [JsonProperty("Completed")]
        Completed,
        [JsonProperty("Aborted")]
        Aborted

    }
}
