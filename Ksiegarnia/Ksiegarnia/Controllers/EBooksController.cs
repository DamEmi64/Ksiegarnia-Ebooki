using Microsoft.AspNetCore.Mvc;
using Domain.Entitites;
using Domain.Repositories;
using System.Net;
using Domain.Enums;

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
        private readonly IEBookReaderRepository eBookReaderRepository;

        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="repository">Repo</param>
        public EBooksController(IEBookRepository repository)
        {
            _bookRepository = repository;
        }

        /// <summary>
        ///     Get books list via paramereters
        /// </summary>
        /// <param name="authorName">Author name</param>
        /// <param name="genre">Genre</param>
        /// <returns>List of books</returns>
        [HttpGet("search")]
        public async Task<List<EBook>> Index([FromQuery] string authorName, [FromQuery] string genre)
        {
            var books = await _bookRepository.GetEBooks();

            if (Enum.TryParse(genre, out Genre genreEnum))
            {
                books = books.Where(x => x.Genre == genreEnum).ToList();
            }
            if (!string.IsNullOrEmpty(authorName))
            {
                books = books.Where(x => x.Author.UserName == authorName).ToList();
            }

            return books;
        }

        /// <summary>
        ///     Get Ebook details by id
        /// </summary>
        /// <param name="id">Ebook Id</param>
        /// <returns></returns>
        [HttpGet("/{id}")]
        public async Task<EBook> Details(Guid? id)
        {
            var ebook = await _bookRepository.GetEbook(id ?? Guid.Empty);
            if (ebook == null)
            {
                throw new Exception("Ebook not found");
            }

            return ebook;
        }
        /// <summary>
        ///     Get Ebook content by id
        /// </summary>
        /// <param name="id">Ebook Id</param>
        /// <returns></returns>
        [HttpGet("/{id}/read")]
        public async Task<byte[]> Read(Guid? id)
        {
            var ebook = await _bookRepository.GetEbook(id ?? Guid.Empty);
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
        [HttpPost("create")]
        [ValidateAntiForgeryToken]
        public async Task<HttpStatusCode> Create([FromBody] EBook eBook)
        {
            if (ModelState.IsValid)
            {
                eBook.Id = Guid.NewGuid();
                await _bookRepository.AddEbook(eBook);
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
        public async Task<HttpStatusCode> Edit([FromBody] EBook eBook)
        {
            if (ModelState.IsValid)
            {
                await _bookRepository.RemoveEbook(eBook.Id);
                await _bookRepository.SaveChanges();
                await _bookRepository.AddEbook(eBook);
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
            var book = await _bookRepository.GetEbook(new Guid(id));
            
            if (book != null)
            {
                await _bookRepository.RemoveEbook(book.Id);

                return HttpStatusCode.OK;
            }

            return HttpStatusCode.NotFound;
        }
    }
}
