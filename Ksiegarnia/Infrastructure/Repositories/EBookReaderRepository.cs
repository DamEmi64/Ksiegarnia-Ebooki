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
        public async Task CreateTransaction(Transaction transaction)
        {
           await _context.Set<Transaction>().AddAsync(transaction);
        }

        public async Task<EBookReader?> Get(Guid id)
        {
           return await _context.Set<EBookReader>().FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<Transaction?> GetTransaction(Guid id)
        {
            return (await _context.Set<EBookReader>().FirstOrDefaultAsync(x => x.Id == id))?.Transaction;
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}
