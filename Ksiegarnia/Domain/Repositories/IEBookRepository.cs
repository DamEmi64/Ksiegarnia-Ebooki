using Domain.Entitites;

namespace Domain.Repositories
{
    public interface IEBookRepository
    {
        Task<List<EBook>> GetEBooks(List<string>? genres = null, List<int>? years = null, string AuthorName = "");

        Task Remove(Guid bookId);

        Task Add(EBook book);

        Task<EBook?> Get(Guid id);

        Task SaveChanges();

        Task Verify(Guid id, string data);

        Task<bool> CheckIfExist(byte[] data);

    }
}
