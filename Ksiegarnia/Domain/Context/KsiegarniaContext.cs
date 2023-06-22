using Domain.Entitites;
using Domain.EntityConfiguration;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace Domain.Context
{
    /// <summary>
    ///     Context of database
    /// </summary>
    public class KsiegarniaContext : IdentityDbContext<User, Role, string>
    {
        public KsiegarniaContext(DbContextOptions<KsiegarniaContext> options)
            : base(options)
        {
/*            if (Database.GetPendingMigrations().Count() > 0)
            {
                Database.Migrate();
            }*/
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            new EBookEnitityConfiguration().Configure(builder.Entity<EBook>());
            new EBookReaderEntityConfiguration().Configure(builder.Entity<EBookReader>());
            new UserEntityConfiguration().Configure(builder.Entity<User>());
            new PromotionEntityConfiguration().Configure(builder.Entity<Promotion>());
            new ReviewEnitityConfiguration().Configure(builder.Entity<Review>());
            new NotificationEntityConfiguration().Configure(builder.Entity<Notification>());

            base.OnModelCreating(builder);
        }

        public DbSet<EBook> Ebooks { get; set; } = default!;

        public DbSet<EBookReader> Readers { get; set; }

        public DbSet<Transaction> Transactions { get; set; }

        public DbSet<Promotion> Promotions { get; set; }

        public DbSet<Premium> Premiums { get; set; }

        public DbSet<Review> Reviews { get; set; }

        public DbSet<Notification> Notifications { get; set; }

    }
}
