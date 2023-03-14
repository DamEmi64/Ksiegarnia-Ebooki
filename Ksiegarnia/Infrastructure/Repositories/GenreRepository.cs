using Domain.Context;
using Domain.Entitites;
using Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class GenreRepository : IGenreRepository
    {
        private readonly KsiegarniaContext _context;

        public GenreRepository(KsiegarniaContext ksiegarniaContext)
        {
            _context = ksiegarniaContext;
        }
        public async Task Add(Genre genre)
        {
            await _context.Set<Genre>().AddAsync(genre);
        }

        public async Task<Genre?> Get(Guid id)
        {
            return await _context.Set<Genre>().FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<Genre>> GetAll()
        {
            return await _context.Set<Genre>().ToListAsync(); ;
        }

        public async Task Remove(Guid id)
        {
            var genre = await _context.Set<Genre>().FirstOrDefaultAsync(x => x.Id == id);
            if (genre != null)
            {
                _context.Set<Genre>().Remove(genre);
            }
        }

        public async Task SaveChanges()
        {
            await _context.SaveChangesAsync();
        }
    }
}
