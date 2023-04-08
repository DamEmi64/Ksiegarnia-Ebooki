using Microsoft.AspNetCore.Builder;

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

        public static void ConfigureConst(this WebApplicationBuilder builder)
        {
            CopyLeaksToken = builder.Configuration["CopyLeaksToken"] ?? string.Empty;
            Email = builder.Configuration["CopyLeaksEmail"] ?? string.Empty;
            CopyLeaksAPIKey = builder.Configuration["CopyLeaksAPIKey"] ?? string.Empty;
            WebHookHost = new Uri(builder.Configuration["WebHookHost"] ?? "https://localhost:7270");
            ServerName = builder.Configuration["ServerName"] ?? string.Empty;
        }
    }
}
