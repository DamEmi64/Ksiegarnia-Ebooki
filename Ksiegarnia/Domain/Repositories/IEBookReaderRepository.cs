using Domain.Entitites;

namespace Domain.Repositories
{
    public interface IEBookReaderRepository
    {
        Task Add(Transaction transaction);
        Task<EBookReader> Get(Guid id);
        Task<Transaction> GetTransaction(Guid id);
        IEnumerable<Transaction> GetTransactions(string id);
        Task SaveChanges();


    }
}
