using Domain.Context;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Repositories;
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
            webApplicationBuilder.ConfigureIdentity();
            webApplicationBuilder.Services.AddScoped<IUserRepository, UserRepository>()
                                    .AddScoped<IEBookRepository, EbookRepository>()
                                    .AddScoped<IEBookReaderRepository, EBookReaderRepository>();
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

            builder.Services.Configure<IdentityOptions>(options =>
            {
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;
            });

            builder.Services.ConfigureApplicationCookie(options =>
            {
                options.AccessDeniedPath = "/Identity/Account/AccessDenied";
                options.Cookie.Name = "YourAppCookieName";
                options.Cookie.HttpOnly = false;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
                options.LoginPath = "/Identity/Account/Login";
                options.ReturnUrlParameter = CookieAuthenticationDefaults.ReturnUrlParameter;
                options.SlidingExpiration = true;
            });

            return builder;
        }
    }
}
