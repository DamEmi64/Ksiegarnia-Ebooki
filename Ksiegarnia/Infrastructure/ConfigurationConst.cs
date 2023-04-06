namespace Infrastructure
{
    public static class ConfigurationConst
    {
        public static string CopyLeaksAPIKey { get; set; }
        public static string CopyLeaksToken { get; set; }
        public static string Email { get; set; }
        public static Uri WebHookHost { get; set; }
        public static string ServerName { get; set; }

        public static string EmailPassword { get; set; }

        public static int SmtpPort { get; set; }

        public static string SmtpServer { get; set; }
    }
}
