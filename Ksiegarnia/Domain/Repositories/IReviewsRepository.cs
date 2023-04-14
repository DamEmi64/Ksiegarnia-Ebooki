using Domain.Entitites;

namespace Domain.Repositories
{
    public interface IReviewsRepository
    {

        Task<IEnumerable<Review>> GetReviews(Guid bookId);

        Task<Review?> Get(Guid reviewId);

        Task Add(Review review);

        Task Remove(Guid reviewId);

        Task SaveChanges();
    }
}
