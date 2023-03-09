using Domain.Context;
using Infrastructure;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<KsiegarniaContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("KsiegarniaContext") ?? throw new InvalidOperationException("Connection string 'KsiegarniaContext' not found.")));

// Add services to the container.

builder.Services.AddControllersWithViews();
builder.Services.AddSwaggerGen();

builder.Configure();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
