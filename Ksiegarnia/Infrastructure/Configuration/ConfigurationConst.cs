using Infrastructure.Configuration.Structures;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Infrastructure
{
    /// <summary>
    ///     Const configuration
    /// </summary>
    public static class ConfigurationConst
    {
        /// <summary>
        ///     Copy Leak config
        /// </summary>
        public static CopyLeakStruct CopyLeak { get; set; }

        /// <summary>
        ///     Smtp Email config
        /// </summary>
        public static SMTPstruct SMTP { get; set; }

        /// <summary>
        ///     Paypal config
        /// </summary>
        public static PaypalStruct Paypal { get; set; }

        public static void ConfigureConst(this WebApplicationBuilder builder)
        {
            CopyLeak = builder.Configuration.GetSection("CopyLeak").Get<CopyLeakStruct>();
            SMTP = builder.Configuration.GetSection("SMTP").Get<SMTPstruct>(); ;
            Paypal = builder.Configuration.GetSection("Paypal").Get<PaypalStruct>(); ;
        }
    }
}
