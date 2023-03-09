using Domain.Entitites;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Domain.EntityConfiguration
{
    internal class EBookReaderEntityConfiguration : IEntityTypeConfiguration<EBookReader>
    {
        public void Configure(EntityTypeBuilder<EBookReader> builder)
        {
            builder.HasKey(x=>x.Id);
        }
    }
}
