using Domain.Context;
using Domain.Entitites;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class EBookReaderRepository : IEBookReaderRepository
    {
        private readonly KsiegarniaContext _context;

        public EBookReaderRepository(KsiegarniaContext ksiegarniaContext)
        {
            _context = ksiegarniaContext;
        }
        public async Task Add(Transaction transaction)
        {
            await _context.Set<Transaction>().AddAsync(transaction);
        }

        public async Task<EBookReader?> Get(Guid id)
        {
            return await _context.Set<EBookReader>().FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<EBookReader?> Get(string userId, Guid bookdId)
        {
            return await _context.Set<EBookReader>()
                        .Include(x => x.User)
                        .Include(x => x.EBook)
                        .FirstOrDefaultAsync(x => x.User.Id == userId && x.EBook.Id == bookdId);
        }

        public async Task<Transaction?> GetTransaction(Guid id)
        {
            return (await _context.Set<EBookReader>().FirstOrDefaultAsync(x => x.Id == id))?.Transaction;
        }

        public IEnumerable<Transaction> GetTransactions(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return _context.Set<Transaction>()
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.EBook)
                    .ThenInclude(z => z.Author)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.User)
                    .Where(x => x.EBookReaders.Any(y => y.User.Id == id));
            }
            return _context.Set<Transaction>()
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.EBook)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.User);
        }

        public void Remove(Transaction transaction)
        {
            _context.Set<EBookReader>().RemoveRange(transaction.EBookReaders ?? new List<EBookReader>());

            _context.Set<Transaction>().Remove(transaction);
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}
