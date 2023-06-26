using Domain.Entitites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.EntityConfiguration
{
    public class UserEntityConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.AccessFailedCount);
            builder.Property(e => e.LastName).IsRequired();
            builder.Property(e => e.Email).IsRequired();
            builder.Property(e => e.NormalizedEmail);
            builder.Property(e => e.NormalizedUserName);
            builder.Property(e => e.PasswordHash);
            builder.Property(e => e.SecurityStamp);
            builder.Property(e => e.UserName).IsRequired();
            builder.Property(e => e.ConcurrencyStamp);
            builder.Property(e => e.EmailConfirmed);
            builder.Property(e => e.LockoutEnabled);
            builder.Property(e => e.LockoutEnd);
            builder.Property(e => e.TwoFactorEnabled);
            builder.Property(x => x.Wallet).HasPrecision(10, 2);
            builder.Property(e => e.FirstName).IsRequired();
            builder.HasMany(x => x.EBooks).WithOne(x => x.User).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
