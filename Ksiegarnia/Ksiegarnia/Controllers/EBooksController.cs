using Microsoft.AspNetCore.Mvc;
using Domain.Entitites;
using Domain.Repositories;
using System.Net;
using Domain.DTOs;
using Infrastructure.Services.Interfaces;
using Domain.Enums;
using Infrastructure.Exceptions;

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
        private readonly IUserRepository _userRepository;
        private readonly IGenreRepository _genreRepository;

        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="repository">Repo</param>
        public EBooksController(IEBookRepository repository, IUserRepository userRepository, IGenreRepository genreRepository)
        {
            _bookRepository = repository;
            _userRepository = userRepository;
            _genreRepository = genreRepository;
        }

        /// <summary>
        ///     Get books list via paramereters
        /// </summary>
        /// <param name="authorName">Author name</param>
        /// <param name="genre1">Genre</param>
        /// <param name="genre2">Genre</param>
        /// <param name="genre3">Genre</param>
        /// <param name="maxPrize">Max Prize</param>
        /// <param name="minPrize">Min prize</param>
        /// <param name="sort">Sorting order</param>
        /// <param name="page">Page</param>
        /// <returns>List of books</returns>
        [HttpGet("search")]
        public async Task<List<BookDto>> Index([FromQuery] string? authorName = "",
                                                [FromQuery] string? genre1 = "",
                                                [FromQuery] string? genre2 = "",
                                                [FromQuery] string? genre3 = "",
                                                [FromQuery] SortType sort = default,
                                                [FromQuery] decimal? maxPrize = 0,
                                                [FromQuery] decimal? minPrize = 0,
                                                [FromQuery] int page = 0)
        {
            var books = await _bookRepository.GetEBooks();

            books = books.Where(x => x.Prize >= minPrize
                            && ((string.IsNullOrEmpty(genre1) || x.Genre.Name == genre1)
                            || (string.IsNullOrEmpty(genre2) || x.Genre.Name == genre2)
                            || (string.IsNullOrEmpty(genre3) || x.Genre.Name == genre3))).ToList();

            if (!string.IsNullOrEmpty(authorName))
            {
                books = books.Where(x => x.Author.UserName == authorName).ToList();
            }

            if (maxPrize > 0)
            {
                books = books.Where(x => x.Prize < maxPrize).ToList();
            }

            var bookDtos = sort switch
            {
                SortType.DescByPrize => books.OrderByDescending(x => x.Prize).ToDTOs().ToList(),
                SortType.DescByGenre => books.OrderByDescending(x => x.Genre).ToDTOs().ToList(),
                SortType.DescByDate => books.OrderByDescending(x => x.Prize).ToDTOs().ToList(),
                SortType.DescByAuthor => books.OrderByDescending(x => x.Author.Nick).ToDTOs().ToList(),
                SortType.AscByAuthor => books.OrderBy(x => x.Author.Nick).ToDTOs().ToList(),
                SortType.AscByDate => books.OrderBy(x => x.Date).ToDTOs().ToList(),
                SortType.AscByGenre => books.OrderBy(x => x.Genre.Name).ToDTOs().ToList(),
                SortType.AscByPrize => books.OrderBy(x => x.Prize).ToDTOs().ToList(),
                SortType.DescByName => books.OrderByDescending(x => x.Title).ToDTOs().ToList(),
                SortType.AscByName => books.OrderBy(x => x.Title).ToDTOs().ToList(),
                _ => books.OrderBy(x => x.Title).ToDTOs().ToList()
            };

            var count = bookDtos.Count() - page * 100;

            if (count > 100)
            {
                return bookDtos.GetRange(page * 100, 100);
            }
            else
            {
                return bookDtos.GetRange(page * 100, count);
            }
        }

        /// <summary>
        ///     Get Ebook details by id
        /// </summary>
        /// <param name="id">Ebook id</param>
        /// <returns>Ebook details</returns>
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        /// <exception cref="BookNotVerifiedException">When book is not verified...</exception>
        [HttpGet("{id}")]
        public async Task<BookDto> Details(Guid? id)
        {
            var ebook = await _bookRepository.Get(id ?? Guid.Empty);
            if (ebook == null)
            {
                throw new BookNotFoundException(id.ToString() ?? String.Empty);
            }

            if (!ebook.Verified)
            {
                throw new BookNotVerifiedException();
            }

            if (!ebook.Verified)
            {
                throw new BookNotVerifiedException();
            }

            return ebook.ToDTO();
        }
        /// <summary>
        ///     Get Ebook content by id
        /// </summary>
        /// <param name="id">Ebook Id</param>
        /// <returns>Ebook content</returns>
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        /// <exception cref="BookNotVerifiedException">When book is not verified...</exception>
        [HttpGet("{id}/read")]
        public async Task<byte[]> Read(Guid? id)
        {
            var ebook = await _bookRepository.Get(id ?? Guid.Empty);
            if (ebook == null)
            {
                throw new BookNotFoundException(id.ToString() ?? string.Empty);
            }
            
            if (!ebook.Verified)
            {
                throw new BookNotVerifiedException();
            }

            if (!ebook.Verified)
            {
                throw new BookNotVerifiedException();
            }

            return ebook.Content;
        }

        /// <summary>
        ///     Create book
        /// </summary>
        /// <param name="eBook">Ebook</param>
        /// <returns></returns>
        /// <exception cref="UserNotFoundException">When user not found...</exception>
        /// <exception cref="BookHasThisContentException">When book with same content exist...</exception>
        [HttpPost("")]
        [ValidateAntiForgeryToken]
        public async Task<HttpStatusCode> Create([FromBody] CreateBookDto eBook)
        {
            if (ModelState.IsValid)
            {
                var author = await _userRepository.Get(eBook.Author.Id);
                if (author == null)
                {
                    throw new UserNotFoundException(eBook.Author.Id);
                }

                if (await _bookRepository.CheckIfExist(eBook.Content))
                {
                    throw new BookHasThisContentException(eBook.Title);
                }

                var genre = await _genreRepository.Get(eBook.Genre.Id);

                if (genre == null)
                {
                    throw new GenreNotFoundException();
                }

                var book = new EBook()
                {
                    Id = Guid.NewGuid(),
                    Author = author,
                    Content = eBook.Content,
                    Description = eBook.Description,
                    PageNumber = eBook.PageNumber,
                    Title = eBook.Title,
                    Date = DateTime.UtcNow,
                    Picture = eBook.Picture,
                    Genre = genre,
                    Prize = eBook.Prize,
                    Verified = false
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
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        [HttpPut("{id}")]
        [ValidateAntiForgeryToken]
        public async Task<HttpStatusCode> Edit([FromBody] CreateBookDto eBook, Guid id)
        {
            if (ModelState.IsValid)
            {
                var book = await _bookRepository.Get(id);

                if (book == null)
                {
                    throw new BookNotFoundException(id.ToString());
                }
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
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        [HttpDelete("/{id}")]
        public async Task<HttpStatusCode> Delete(string id)
        {
            if (Guid.TryParse(id, out Guid bookId))
            {
                var book = await _bookRepository.Get(bookId);

                if (book != null)
                {
                    await _bookRepository.Remove(book.Id);

                    return HttpStatusCode.OK;
                }
            }

            throw new BookNotFoundException(id);
        }

        /// <summary>
        ///     Verify book
        /// </summary>
        /// <param name="id">Book id</param>
        /// <param name="verifyName">Verification Data (name)</param>
        /// <returns></returns>
        [HttpGet("/{id}/verify")]
        public async Task<HttpStatusCode> Verify(Guid id, [FromQuery] string verifyName)
        {
            await _bookRepository.Verify(id, verifyName);
            return HttpStatusCode.OK;
        }
    }
}
