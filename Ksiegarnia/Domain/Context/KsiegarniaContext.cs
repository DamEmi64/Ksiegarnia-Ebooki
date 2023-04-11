using Domain.Entitites;
using Domain.EntityConfiguration;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace Domain.Context
{
    public class KsiegarniaContext : IdentityDbContext<User,Role,string>
    {
        public KsiegarniaContext(DbContextOptions<KsiegarniaContext> options)
            : base(options)
        {
      //     Database.EnsureCreated();
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            new EBookEnitityConfiguration().Configure(builder.Entity<EBook>());
            new EBookReaderEntityConfiguration().Configure(builder.Entity<EBookReader>());
            new UserEntityConfiguration().Configure(builder.Entity<User>());
            new PromotionEntityConfiguration().Configure(builder.Entity<Promotion>());

            base.OnModelCreating(builder);
        }

        public DbSet<EBook> Ebooks { get; set; } = default!;

        public DbSet<EBookReader> Readers { get; set; }

        public DbSet<Transaction> Transactions { get; set; }

        public DbSet<Promotion> Promotions { get; set; }

    }
}
