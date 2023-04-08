using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Configuration
{
    public static class CORSConfiguration
    {
        /// <summary>
        ///     Configure CROS
        /// </summary>
        /// <param name="builder"></param>
        public static WebApplicationBuilder ConfigureCORS(this WebApplicationBuilder builder)
        {
            builder.Services.AddCors(options =>
              options.AddPolicy(name: "allowAll",
              policy =>
              {
                  policy.AllowAnyHeader();
                  policy.AllowAnyOrigin();
                  policy.AllowAnyMethod();
              }));

            return builder;
        }

    }
}
