namespace Infrastructure.Configuration.Structures
{
    /// <summary>
    ///     Paypal config structure
    /// </summary>
    public class PaypalStruct
    {
        /// <summary>
        ///     Client Id
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        ///     Client secret
        /// </summary>
        public string ClientSecret { get; set; }

        /// <summary>
        ///     Mode
        /// </summary>
        public string Mode { get; set; }

        /// <summary>
        ///     Paypal email
        /// </summary>
        public string Email { get; set; }
    }
}
