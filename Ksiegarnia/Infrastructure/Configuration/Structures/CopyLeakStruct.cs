namespace Infrastructure.Configuration.Structures
{
    /// <summary>
    ///     Copy Leak config structure
    /// </summary>
    public class CopyLeakStruct
    {
        /// <summary>
        ///     Copy Leaks Api Key
        /// </summary>
        public string CopyLeaksAPIKey { get; set; }

        /// <summary>
        ///     Copy leaks Token
        /// </summary>
        public string CopyLeaksToken { get; set; }

        /// <summary>
        ///     Email
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        ///     Webhook host for response
        /// </summary>
        public Uri WebHookHost { get; set; }
    }
}
