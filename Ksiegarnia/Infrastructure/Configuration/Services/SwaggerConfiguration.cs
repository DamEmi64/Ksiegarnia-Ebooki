using Infrastructure.Converters;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text.Json.Serialization;

namespace Infrastructure.Configuration
{
    /// <summary>
    ///     Swagger config
    /// </summary>
    public static class SwaggerConfiguration
    {
        /// <summary>
        ///     Configure swagger
        /// </summary>
        /// <param name="builder"></param>
        public static WebApplicationBuilder ConfigureSwagger(this WebApplicationBuilder builder)
        {
            builder.Services.AddSwaggerGen(options =>
            {
                options.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
                options.SchemaFilter<EnumSchemaFilter>();
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Ksiegarnia Ebookow - BackEnd",
                });
                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetEntryAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath, false);
            });

            builder.Services.AddControllersWithViews().AddJsonOptions(options =>
            {

                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

            return builder;
        }
    }
}