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
            foreach (var book in await _context.Set<EBook>().ToListAsync())
            {
                if (book.Content.SequenceEqual(data))
                {
                    return true;
                }
            }

            return false;
        }

        public async Task<EBook?> Get(Guid id)
        {
            return await _context.Set<EBook>().Include(x => x.Genre)
                                                .Include(x => x.Author)
                                                .Include(x => x.Promotion)
                                                .Include(x => x.Distinction)
                                                .Include(x=>x.Readers)
                                                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<List<EBook>> GetEBooks(List<string>? genres = null, List<int>? years = null, string AuthorName = "")
        {
            return await _context.Set<EBook>()
                .Include(x => x.Genre)
                .Include(x => x.Author)
                .Include(x => x.Promotion)
                .Where(x => (string.IsNullOrEmpty(AuthorName) || x.Author.Nick == AuthorName)
                            && (years == null || years.Count == 0 || years.Contains(x.Date.Year))
                            && (genres == null || genres.Count == 0 || genres.Contains(x.Genre.Name))
                            )
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
                book.Verification = Domain.Enums.VerificationType.Accepted;
            }
        }
    }
}
