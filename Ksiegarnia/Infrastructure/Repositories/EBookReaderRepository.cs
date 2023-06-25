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
                        .ThenInclude(x=>x.Author)
                        .Include(x => x.Reviews)
                        .Include(x => x.EBook)
                        .ThenInclude(x => x.Genre)
                        .FirstOrDefaultAsync(x => x.User.Id == userId && x.EBook.Id == bookdId);
        }

        public async Task<Transaction?> GetTransaction(Guid id)
        {
            return (await _context.Set<Transaction>()
                    .Include(x => x.Premium)
                    .Include(x=>x.EBookReaders)
                    .ThenInclude(x=>x.EBook)
                    .ThenInclude(x=>x.Author)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(x=>x.Reviews)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(x => x.EBook)
                    .ThenInclude(x => x.Genre)
                    .FirstOrDefaultAsync(x => x.Id == id));
        }

        public IEnumerable<Transaction> GetTransactions(string id, bool isAuthor = false)
        {
            if (!string.IsNullOrEmpty(id) && !isAuthor)
            {
                return _context.Set<Transaction>()
                    .Include(x => x.Premium)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.EBook)
                    .ThenInclude(z => z.Author)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.EBook)
                    .ThenInclude(z => z.Genre)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.User)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.Reviews)
                    .Where(x => x.EBookReaders.Any(y => y.User.Id == id));
            }

            if (!string.IsNullOrEmpty(id) && isAuthor)
            {
                return _context.Set<Transaction>()
                    .Include(x => x.Premium)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.EBook)
                    .ThenInclude(z => z.Author)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.EBook)
                    .ThenInclude(z => z.Genre)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.User)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.Reviews)
                    .Where(x => x.EBookReaders.Any(y => y.EBook.Author.Id == id));
            }

            return _context.Set<Transaction>()
                    .Include(x => x.Premium)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.EBook)
                    .ThenInclude(z => z.Author)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.EBook)
                    .ThenInclude(z => z.Genre)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.User)
                    .Include(x => x.EBookReaders)
                    .ThenInclude(y => y.Reviews);
        }

        public void Remove(Transaction transaction)
        {
            _context.Set<EBookReader>().RemoveRange(transaction.EBookReaders ?? new List<EBookReader>());

            _context.Set<Transaction>().Remove(transaction);
        }

        public void CleanTransaction(Transaction transaction)
        {
            if (transaction.EBookReaders != null)
            {
                _context.Set<EBookReader>().RemoveRange(transaction.EBookReaders ?? new List<EBookReader>());
            }

            if (transaction.Premium != null)
            {
                _context.Set<Premium>().Remove(transaction.Premium);
            }

        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}
