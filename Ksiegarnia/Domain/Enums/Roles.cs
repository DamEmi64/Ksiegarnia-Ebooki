using Newtonsoft.Json;

namespace Domain.Enums
{
    public enum Roles
    {
        [JsonProperty("Admin")]
        Admin,
        [JsonProperty("PremiumUser")]
        PremiumUser,
        [JsonProperty("User")]
        User
    }
}
