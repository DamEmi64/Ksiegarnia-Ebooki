using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Domain.Enums
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum NotificationStatus
    {
        Reported,
        Accepted,
        Abandoned,
        Completed,
        Aborted

    }
}
