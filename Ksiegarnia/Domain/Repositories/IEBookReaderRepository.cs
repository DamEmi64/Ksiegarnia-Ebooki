using Domain.Entitites;

namespace Domain.Repositories
{
    public interface IEBookReaderRepository
    {
        Task Add(Transaction transaction);
        void Remove(Transaction transaction);
        void CleanTransaction(Transaction transaction);
        Task<EBookReader?> Get(Guid id);
        Task<EBookReader?> Get(string userId, Guid bookdId);
        Task<Transaction> GetTransaction(Guid id);
        IEnumerable<Transaction> GetTransactions(string id, bool isAuthor = false);
        Task SaveChanges();


    }
}
