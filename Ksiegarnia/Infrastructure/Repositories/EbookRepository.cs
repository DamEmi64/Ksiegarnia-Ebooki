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

        public async Task Add(EBook book)
        {
            book.Date = DateTime.UtcNow;
            await _context.Set<EBook>().AddAsync(book);
        }

        public async Task<bool> CheckIfExist(byte[] data)
        {
            return await _context.Set<EBook>().AnyAsync(x => x.Content.SequenceEqual(data));
        }

        public async Task<EBook?> Get(Guid id)
        {
            return await _context.Set<EBook>().Include(x => x.Genre).Include(x => x.Author).FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<List<EBook>> GetEBooks()
        {
            return await _context.Set<EBook>()
                .Include(x=>x.Genre)
                .Include(x=>x.Author)
                .Include(x=>x.Promotion)
                .ToListAsync();
        }

        public async Task Remove(Guid bookId)
        {
            var book = await _context.Set<EBook>().FirstOrDefaultAsync(x => x.Id == bookId);
            if (book != null)
            {
                _context.Set<EBook>().Remove(book);
            }
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }

        public async Task Verify(Guid id, string data)
        {
            var book = await Get(id);
            if (book != null)
            {
                book.Verified = true;
            }
        }
    }
}
