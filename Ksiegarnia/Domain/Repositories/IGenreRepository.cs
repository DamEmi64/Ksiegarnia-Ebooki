using Domain.Entitites;

namespace Domain.Repositories
{
    public interface IGenreRepository
    {
        Task Add(Genre genre);

        Task<IEnumerable<Genre>> GetAll();

        Task Remove(Guid id);

        Task<Genre> Get(Guid id);

        Task SaveChanges();
    }
}
