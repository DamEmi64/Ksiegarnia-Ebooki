using Microsoft.AspNetCore.Mvc;
using Domain.Entitites;
using Domain.Repositories;
using System.Net;
using Domain.DTOs;
using Infrastructure.Services.Interfaces;

namespace Application.Controllers
{
    /// <summary>
    ///     Ebook Controller
    /// </summary>
    [Route("Books")]
    [ApiController]
    public class EBooksController : Controller
    {
        private readonly IEBookRepository _bookRepository;
        private readonly IEBookReaderRepository _eBookReaderRepository;
        private readonly IUserRepository _userRepository;
        private readonly ICopyLeaksService _copyLeaksService;

        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="repository">Repo</param>
        public EBooksController(IEBookRepository repository, IUserRepository userRepository, IEBookReaderRepository eBookReaderRepository, ICopyLeaksService copyLeaksService)
        {
            _bookRepository = repository;
            _userRepository = userRepository;
            _eBookReaderRepository = eBookReaderRepository;
            _copyLeaksService = copyLeaksService;
        }

        /// <summary>
        ///     Get books list via paramereters
        /// </summary>
        /// <param name="authorName">Author name</param>
        /// <param name="genre">Genre</param>
        /// <returns>List of books</returns>
        [HttpGet("search")]
        public async Task<List<BookDto>> Index([FromQuery] string authorName, [FromQuery] string genre)
        {
            var books = await _bookRepository.GetEBooks();
            books = books.Where(x => x.Genre.Name == genre).ToList();
            if (!string.IsNullOrEmpty(authorName))
            {
                books = books.Where(x => x.Author.UserName == authorName).ToList();
            }

            return books.ToDTOs().ToList();
        }

        /// <summary>
        ///     Get Ebook details by id
        /// </summary>
        /// <param name="id">Ebook Id</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<BookDto> Details(Guid? id)
        {
            var ebook = await _bookRepository.Get(id ?? Guid.Empty);
            if (ebook == null)
            {
                throw new Exception("Ebook not found");
            }

            return ebook.ToDTO();
        }
        /// <summary>
        ///     Get Ebook content by id
        /// </summary>
        /// <param name="id">Ebook Id</param>
        /// <returns></returns>
        [HttpGet("{id}/read")]
        public async Task<byte[]> Read(Guid? id)
        {
            var ebook = await _bookRepository.Get(id ?? Guid.Empty);
            if (ebook == null)
            {
                throw new Exception("Ebook not found");
            }

            return ebook.Content;
        }

        /// <summary>
        ///     Create book
        /// </summary>
        /// <param name="eBook">Ebook</param>
        /// <returns></returns>
        [HttpPost("")]
        [ValidateAntiForgeryToken]
        public async Task<HttpStatusCode> Create([FromBody] CreateBookDto eBook)
        {
            if (ModelState.IsValid)
            {
                var author = await _userRepository.Get(eBook.Author.Id);
                if (author == null)
                {
                    throw new Exception("User Not Found");
                }
                var book = new EBook()
                {
                    Id = Guid.NewGuid(),
                    Author = author,
                    Content = eBook.Content,
                    Description = eBook.Description,
                    PageNumber = eBook.PageNumber,
                    Title = eBook.Title
                };
                await _bookRepository.Add(book);
                await _bookRepository.SaveChanges();
                return HttpStatusCode.Created;
            }
            return HttpStatusCode.BadRequest;
        }

        /// <summary>
        ///     Update book
        /// </summary>
        /// <param name="eBook">Ebook</param>
        /// <returns></returns>
        [HttpPut("{id}")]
        [ValidateAntiForgeryToken]
        public async Task<HttpStatusCode> Edit([FromBody] CreateBookDto eBook, Guid id)
        {
            if (ModelState.IsValid)
            {
                var book = await _bookRepository.Get(id);
                book.Content = eBook.Content;
                book.Description = eBook.Description;
                book.Title = eBook.Title;
                await _bookRepository.SaveChanges();
                return HttpStatusCode.OK;
            }
            return HttpStatusCode.BadRequest;
        }

        /// <summary>
        ///     Delete Ebook by id
        /// </summary>
        /// <param name="id">Ebook Id</param>
        /// <returns></returns>
        [HttpDelete("/{id}")]
        public async Task<HttpStatusCode> Delete(string id)
        {
            var book = await _bookRepository.Get(new Guid(id));

            if (book != null)
            {
                await _bookRepository.Remove(book.Id);

                return HttpStatusCode.OK;
            }

            return HttpStatusCode.NotFound;
        }
    }
}
