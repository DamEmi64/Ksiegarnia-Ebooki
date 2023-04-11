using Domain.Entitites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Domain.EntityConfiguration
{
    internal class PromotionEntityConfiguration : IEntityTypeConfiguration<Promotion>
    {
        public void Configure(EntityTypeBuilder<Promotion> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Prize).HasPrecision(5, 2);
            builder.Property(x => x.PremiumPrize).HasPrecision(5, 2);

        }
    }
}
