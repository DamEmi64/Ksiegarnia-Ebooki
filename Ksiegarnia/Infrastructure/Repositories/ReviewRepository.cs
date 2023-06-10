using Domain.Context;
using Domain.Entitites;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ReviewRepository : IReviewsRepository
    {
        private readonly KsiegarniaContext _context;

        public ReviewRepository(KsiegarniaContext ksiegarniaContext)
        {
            _context = ksiegarniaContext;
        }

        public async Task Add(Review review)
        {
            await _context.Set<Review>().AddAsync(review);
        }

        public async Task<Review?> Get(Guid reviewId)
        {
            return await _context.Set<Review>().FirstOrDefaultAsync(x => x.Id == reviewId);
        }

        public async Task<IEnumerable<Review>> GetReviews(Guid bookId)
        {
            if (bookId == Guid.Empty)
            {
                return await _context.Set<Review>()
                           .Include(x => x.Reader)
                           .ThenInclude(x => x.User)
                           .Include(x => x.Reader)
                           .ThenInclude(x => x.EBook)
                           .ThenInclude(x => x.Genre)
                        .ToListAsync();
            }

            return await _context.Set<Review>()
                           .Include(x => x.Reader)
                           .ThenInclude(x => x.User)
                           .Include(x => x.Reader)
                           .ThenInclude(x => x.EBook)
                           .ThenInclude(x => x.Genre)
                        .Where(x => x.Reader.EBook.Id == bookId).ToListAsync();
        }

        public async Task Remove(Guid reviewId)
        {
            var review = await Get(reviewId);

            if (review != null)
            {
                _context.Set<Review>().Remove(review);
            }
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}
