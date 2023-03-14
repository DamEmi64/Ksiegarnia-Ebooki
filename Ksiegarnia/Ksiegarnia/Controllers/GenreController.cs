using Domain.DTOs;
using Domain.Entitites;
using Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Application.Controllers
{
    [Route("Genre")]
    [ApiController]
    public class GenreController : Controller
    {
        private readonly IGenreRepository _genreRepository;

        public GenreController(IGenreRepository genreRepository)
        {
            _genreRepository = genreRepository;
        }

        /// <summary>
        ///  Get List of Genres
        /// </summary>
        /// <returns></returns>
        [HttpGet("")]
        public async Task<List<GenreDto>> Index()
        {
            return (await _genreRepository.GetAll()).ToDTOs().ToList();
        }

        /// <summary>
        ///     Get Genre by id
        /// </summary>
        /// <param name="id">id</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<GenreDto> Details(Guid id)
        {
            return (await _genreRepository.Get(id)).ToDTO();
        }

        /// <summary>
        ///     Add Genre
        /// </summary>
        /// <param name="genreDto">Genre data</param>
        /// <returns></returns>
        [HttpPost("")]
        public async Task<HttpStatusCode> Create(GenreDto genreDto)
        {
            var genre = new Genre()
            {
                Name = genreDto.Name,
                Description = genreDto.Description,
                Id = Guid.NewGuid()
            };
            await _genreRepository.Add(genre);
            return HttpStatusCode.Created;
        }


        [HttpPut("{id}")]
        [ValidateAntiForgeryToken]
        public async Task Edit(Guid id, GenreDto genreDto)
        {
            var genre = await _genreRepository.Get(id);
            if (genre == null)
            {
                throw new Exception("Genre not found");
            }

            genre.Name = genreDto.Name;
            genre.Description = genreDto.Description;

            _genreRepository.SaveChanges();
        }

        // POST: GenreController/Delete/5
        [HttpDelete("{id}")]
        [ValidateAntiForgeryToken]
        public async Task Delete(Guid id)
        {
            await _genreRepository.Remove(id);
        }
    }
}
