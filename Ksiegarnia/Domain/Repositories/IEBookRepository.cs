using Domain.Entitites;

namespace Domain.Repositories
{
    public interface IEBookRepository
    {
        Task<List<EBook>> GetEBooks();

        void RemoveEbook(EBook book);

        Task AddEbook(EBook book);

        Task<EBook?> GetEbook(Guid id);

        Task SaveChanges();

    }
}
