﻿using Domain.Context;
using Infrastructure;
using Infrastructure.Converters;
using Infrastructure.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<KsiegarniaContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("KsiegarniaContext") ?? throw new InvalidOperationException("Connection string 'KsiegarniaContext' not found.")));

// Add services to the container.
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
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);
});

builder.Services.AddControllers().AddJsonOptions(options =>
{

    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Configure();

var app = builder.Build();

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
        context.Response.StatusCode =(int)defaultException.StatusCode;
        await context.Response.WriteAsJsonAsync(new {Title = defaultException.Title, Description = defaultException.Description });
    }
    else
    {
        await context.Response.WriteAsJsonAsync(new { error = exception.Message });
    }

}));
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.MapControllers();

app.MapFallbackToFile("index.html"); ;

app.Run();