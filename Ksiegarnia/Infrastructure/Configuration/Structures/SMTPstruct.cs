namespace Infrastructure.Configuration.Structures
{
    /// <summary>
    ///     SMTP service config structure
    /// </summary>
    public class SMTPstruct
    {
        /// <summary>
        ///     Server name
        /// </summary>
        public string ServerName { get; set; }

        /// <summary>
        ///     Email
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        ///     Password
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        ///     Port
        /// </summary>
        public int SmtpPort { get; set; }

        /// <summary>
        ///     Smtp Server
        /// </summary>
        public string SmtpServer { get; set; }
    }
}
