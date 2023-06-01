using Infrastructure.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Configuration.Services
{
    /// <summary>
    ///     Background Task - configuration
    /// </summary>
    public static class BackgroundTaskConfiguration
    {
        /// <summary>
        ///     Configure ASP.NET Identity
        /// </summary>
        /// <param name="builder"></param>
        public static WebApplicationBuilder ConfigureTasks(this WebApplicationBuilder builder)
        {
            builder.Services.AddHostedService<PremiumChecker>();

            return builder;
        }
    }
}
