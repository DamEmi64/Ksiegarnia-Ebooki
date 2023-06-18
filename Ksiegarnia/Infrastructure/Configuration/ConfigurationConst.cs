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

        /// <summary>
        ///     Number of days of free distinction
        /// </summary>
        public static int FreeTimeDistinct { get; set; }

        /// <summary>
        ///     Prize for distinction
        /// </summary>
        public static decimal PrizeForDistinct { get; set; }

        /// <summary>
        ///     Number of free books to add
        /// </summary>
        public static int FreeStorage { get; set; }

        public static void ConfigureConst(this WebApplicationBuilder builder)
        {
            CopyLeak = builder.Configuration.GetSection("CopyLeak").Get<CopyLeakStruct>();
            SMTP = builder.Configuration.GetSection("SMTP").Get<SMTPstruct>(); ;
            Paypal = builder.Configuration.GetSection("Paypal").Get<PaypalStruct>();
            FreeStorage = builder.Configuration.GetValue<int>("FreeStorage");
            FreeTimeDistinct = builder.Configuration.GetValue<int>("FreeTimeDistinct");
            PrizeForDistinct = builder.Configuration.GetValue<decimal>("PrizeForDistinct");
        }
    }
}
