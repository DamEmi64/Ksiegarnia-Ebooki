﻿using Domain.Repositories;
using Infrastructure.Exceptions;
using Infrastructure.Repositories;
using Infrastructure.Services.Auth;
using Infrastructure.Services.Interfaces;
using Infrastructure.Services.PlagiatSystem;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Net;

namespace Infrastructure.Configuration
{
    public static class Configuration
    {
        public static void Configure(this WebApplicationBuilder webApplicationBuilder)
        {
            //Repos
            webApplicationBuilder.Services.AddScoped<IUserRepository, UserRepository>()
                                    .AddScoped<IEBookRepository, EbookRepository>()
                                    .AddScoped<IEBookReaderRepository, EBookReaderRepository>()
                                    .AddScoped<IGenreRepository, GenreRepository>();
            //Services
            webApplicationBuilder.Services.AddScoped<ICopyLeaksService, CopyLeaksService>()
                                        .AddScoped<IAuthService, AuthService>();

            webApplicationBuilder.ConfigureIdentity()
                                 .ConfigureCORS()
                                 .ConfigureSwagger()
                                 .ConfigureConst();
        }

        public static void Configure(this WebApplication app)
        {

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseExceptionHandler(a => a.Run(async context =>
            {
                var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
                var exception = exceptionHandlerPathFeature.Error;

                if (exception is DefaultException defaultException)
                {
                    context.Response.StatusCode = (int)defaultException.StatusCode;
                    await context.Response.WriteAsJsonAsync(new { Title = defaultException.Title, Description = defaultException.Description });
                }
                else
                {
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    await context.Response.WriteAsJsonAsync(new { error = exception.Message });
                }

            }));

            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseCors("allowAll");
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseRouting();
            app.MapControllers();
            app.UseAuthorization();
            app.MapFallbackToFile("index.html");
        }
    }
}
