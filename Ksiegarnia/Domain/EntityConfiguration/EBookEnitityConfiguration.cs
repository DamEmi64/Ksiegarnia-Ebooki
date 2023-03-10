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
            builder.Property(x => x.Title).HasMaxLength(86).IsRequired();
            builder.Property(x => x.Genre).IsRequired();
            builder.Property(x => x.Content).HasColumnType("TEXT");
            builder.HasOne(x => x.Author).WithMany(x => x.Publications).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
