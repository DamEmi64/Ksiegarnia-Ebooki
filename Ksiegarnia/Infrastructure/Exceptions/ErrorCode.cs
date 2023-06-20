using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Infrastructure.Exceptions
{
    /// <summary>
    ///     Error Codes
    /// </summary>
    [JsonConverter(typeof(StringEnumConverter))]
    public enum ErrorCode
    {
        //BOOKS
        [JsonProperty("BookHasThisContent")]
        BookHasThisContent,
        [JsonProperty("BookNotFound")]
        BookNotFound,
        [JsonProperty("BookNotVerified")]
        BookNotVerified,
        [JsonProperty("BookReviewNotFound")]
        BookReviewNotFound,
        //Genres
        [JsonProperty("GenreNotFound")]
        GenreNotFound,
        //Premium
        [JsonProperty("FreeBonusUsed")]
        FreeBonusUsed,
        [JsonProperty("PremiumBonusesUsed")]
        PremiumBonusesUsed,
        //Transaction
        [JsonProperty("TransactionFailed")]
        TransactionFailed,
        [JsonProperty("TransactionNotFound")]
        TransactionNotFound,
        //Users
        [JsonProperty("UserNotFound")]
        UserNotFound,
        [JsonProperty("ChangeEmailFailed")]
        ChangeEmailFailed,
        [JsonProperty("ChangePasswordFailed")]
        ChangePasswordFailed,
        [JsonProperty("LoginFailed")]
        LoginFailed,
        [JsonProperty("RegisterFailed")]
        RegisterFailed,
        [JsonProperty("TokenNotFound")]
        TokenNotFound,
        [JsonProperty("NotEnoughCashInWallet")]
        NotEnoughCashInWallet
    }
}
