using Domain.DTOs;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Application.Controllers
{
    /// <summary>
    ///     Genre Controller
    /// </summary>
    [Route("Genres")]
    [ApiController]
    public class GenresController : Controller
    {
        private readonly IGenreRepository _genreRepository;
        
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="genreRepository"></param>
        public GenresController(IGenreRepository genreRepository)
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
        /// <exception cref="GenreNotFoundException">When genre not found...</exception>
        [HttpGet("{id}")]
        public async Task<GenreDto> Details(Guid id)
        {
            var genre = await _genreRepository.Get(id);

            if (genre == null)
            {
                throw new GenreNotFoundException();
            }

            return genre.ToDTO();
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
            await _genreRepository.SaveChanges();
            return HttpStatusCode.Created;
        }

        /// <summary>
        ///     Edit Genre
        /// </summary>
        /// <param name="id">Id</param>
        /// <param name="genreDto">Genre Dto</param>
        /// <returns></returns>
        /// <exception cref="GenreNotFoundException"></exception>
        [HttpPut("{id}")]
        public async Task<HttpStatusCode> Edit(Guid id, GenreDto genreDto)
        {
            var genre = await _genreRepository.Get(id);
            if (genre == null)
            {
                throw new GenreNotFoundException();
            }

            genre.Name = genreDto.Name;
            genre.Description = genreDto.Description;

            await _genreRepository.SaveChanges();

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Delete Genre
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns></returns>
        /// <exception cref="GenreNotFoundException">When genre not found...</exception>
        [HttpDelete("{id}")]
        public async Task<HttpStatusCode> Delete(Guid id)
        {
            if (await _genreRepository.Get(id) == null)
            {
                throw new GenreNotFoundException();
            }

            await _genreRepository.Remove(id);
            await _genreRepository.SaveChanges();
            return HttpStatusCode.OK;
        }
    }
}
