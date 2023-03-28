using Domain.Context;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Repositories;
using Infrastructure.Services.Auth;
using Infrastructure.Services.Interfaces;
using Infrastructure.Services.PlagiatSystem;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class Configuration
    {
        public static void Configure(this WebApplicationBuilder webApplicationBuilder)
        {
            //Repos
            webApplicationBuilder.Services.AddScoped<IUserRepository, UserRepository>()
                                    .AddScoped<IEBookRepository, EbookRepository>()
                                    .AddScoped<IUserRepository, UserRepository>()
                                    .AddScoped<IEBookReaderRepository, EBookReaderRepository>();
            //Services
            webApplicationBuilder.Services.AddScoped<ICopyLeaksService, CopyLeaksService>()
                                        .AddScoped<IAuthService, AuthService>();

            webApplicationBuilder.ConfigureIdentity()
                                 .ConfigureConst();
        }
        private static void ConfigureConst(this WebApplicationBuilder builder)
        {
            ConfigurationConst.CopyLeaksToken = builder.Configuration["CopyLeaksToken"] ?? String.Empty;
            ConfigurationConst.Email = builder.Configuration["CopyLeaksEmail"] ?? String.Empty;
            ConfigurationConst.CopyLeaksAPIKey = builder.Configuration["CopyLeaksAPIKey"] ?? String.Empty;
            ConfigurationConst.WebHookHost = new Uri(builder.Configuration["WebHookHost"] ?? "https://localhost:7270");
            ConfigurationConst.ServerName = builder.Configuration["ServerName"] ?? String.Empty;
        }

        /// <summary>
        ///     Configure ASP.NET Identity
        /// </summary>
        /// <param name="builder"></param>
        private static WebApplicationBuilder ConfigureIdentity(this WebApplicationBuilder builder)
        {
            builder.Services.AddIdentity<User, Role>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddEntityFrameworkStores<KsiegarniaContext>()
                .AddDefaultTokenProviders();

            builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
                    options.SlidingExpiration = true;
                    options.AccessDeniedPath = "/Forbidden/";
                    options.Cookie.Name = "Ksiegarnia";
                    options.Cookie.HttpOnly = false;
                    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
                    options.LoginPath = "/Identity/Account/Login";
                    options.ReturnUrlParameter = CookieAuthenticationDefaults.ReturnUrlParameter;
                    options.SlidingExpiration = true;
                });

            builder.Services.Configure<IdentityOptions>(options =>
            {
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;
            });

            return builder;
        }
    }
}
