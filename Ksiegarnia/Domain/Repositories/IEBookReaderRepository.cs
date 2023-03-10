using Domain.Entitites;

namespace Domain.Repositories
{
    public interface IEBookReaderRepository
    {
        Task CreateTransaction(Transaction transaction);
        Task<EBookReader> Get(Guid id);
        Task<Transaction> GetTransaction(Guid id);
        Task SaveChanges();


    }
}
