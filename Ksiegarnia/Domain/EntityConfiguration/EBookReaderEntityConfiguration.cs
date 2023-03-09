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
            builder.HasOne(x => x.Transaction).WithOne(x => x.EBookReader).HasForeignKey<EBookReader>(x=>x.TransactionId).OnDelete(DeleteBehavior.Cascade);
         //   builder.HasOne(x => x.EBook).WithMany(x => x.Readers).HasForeignKey(x=>x.BookId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
