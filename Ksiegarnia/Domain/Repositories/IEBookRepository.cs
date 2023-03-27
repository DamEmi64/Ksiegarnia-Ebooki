using Domain.Entitites;

namespace Domain.Repositories
{
    public interface IEBookRepository
    {
        Task<List<EBook>> GetEBooks();

        Task Remove(Guid bookId);

        Task Add(EBook book);

        Task<EBook?> Get(Guid id);

        Task SaveChanges();

        Task Verify(Guid id, string data);

        Task<bool> CheckIfExist(byte[] data);

    }
}
