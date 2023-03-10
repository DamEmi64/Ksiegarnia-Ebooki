using Domain.Context;
using Domain.Entitites;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class EbookRepository : IEBookRepository
    {
        private readonly KsiegarniaContext _context;

        public EbookRepository(KsiegarniaContext ksiegarniaContext)
        {
            _context = ksiegarniaContext;
        }

        public async Task AddEbook(EBook book)
        {
            await _context.Set<EBook>().AddAsync(book);
        }

        public async Task<EBook?> GetEbook(Guid id)
        {
            return await _context.Set<EBook>().FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<List<EBook>> GetEBooks()
        {
            return await _context.Set<EBook>().ToListAsync();
        }

        public async Task RemoveEbook(Guid bookId)
        {
            var book = await _context.Set<EBook>().FirstOrDefaultAsync(x => x.Id == bookId);
            if(book != null)
            {
                _context.Set<EBook>().Remove(book);
            }
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}
