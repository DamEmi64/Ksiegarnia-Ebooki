using Domain.Context;
using Infrastructure.Configuration;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder();

if (builder.Environment.IsProduction())
{
    builder.Services.AddDbContext<KsiegarniaContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("KsiegarniaAzureContext") ?? throw new InvalidOperationException("Connection string 'KsiegarniaContext' not found.")));
}
else
{
    builder.Services.AddDbContext<KsiegarniaContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("KsiegarniaContext") ?? throw new InvalidOperationException("Connection string 'KsiegarniaContext' not found.")));
}

// Add services
builder.Configure();

var app = builder.Build();

app.Configure();

app.Run();
