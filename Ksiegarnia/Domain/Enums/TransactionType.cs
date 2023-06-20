using Newtonsoft.Json;

namespace Domain.Enums
{
    /// <summary>
    ///     Transaction type
    /// </summary>
    public enum TransactionType
    {
        /// <summary>
        ///     Gift token
        /// </summary>
        [JsonProperty("Token")]
        Token,
        /// <summary>
        ///     Payment via paypal
        /// </summary>
        [JsonProperty("Paypal")]
        Paypal,
        /// <summary>
        ///     Payment via wallet
        /// </summary>
        [JsonProperty("Wallet")]
        Wallet
    }
}
