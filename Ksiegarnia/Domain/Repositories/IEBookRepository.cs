using Domain.Entitites;

namespace Domain.Repositories
{
    public interface IEBookRepository
    {
        Task<List<EBook>> GetEBooks();

        Task RemoveEbook(Guid bookId);

        Task AddEbook(EBook book);

        Task<EBook?> GetEbook(Guid id);

        Task SaveChanges();

    }
}
