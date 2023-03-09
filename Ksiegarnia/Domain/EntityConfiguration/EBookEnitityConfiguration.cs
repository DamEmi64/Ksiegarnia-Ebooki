using Domain.Entitites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Domain.EntityConfiguration
{
    internal class EBookEnitityConfiguration : IEntityTypeConfiguration<EBook>
    {
        public void Configure(EntityTypeBuilder<EBook> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Title).HasMaxLength(86);
            builder.HasOne(x => x.Author).WithMany(x => x.Publications).OnDelete(DeleteBehavior.Cascade);
            builder.HasMany(x=>x.Readers).WithOne(x=>x.EBook).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
