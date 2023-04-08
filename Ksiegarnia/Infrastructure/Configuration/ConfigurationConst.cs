using Infrastructure.Configuration.Structures;
using Microsoft.AspNetCore.Builder;
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
            CopyLeak = JsonConvert.DeserializeObject<CopyLeakStruct>(builder.Configuration["CopyLeak"]) ?? new();
            SMTP = JsonConvert.DeserializeObject<SMTPstruct>(builder.Configuration["SMTP"]) ?? new();
            Paypal = JsonConvert.DeserializeObject<PaypalStruct>(builder.Configuration["Paypal"]) ?? new();
        }
    }
}
