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
        /// <param name="genre">Genre (names)</param>
        /// <param name="onlyOnPromotion">Only books on promotion</param>
        /// <param name="pageSize">page size</param>
        /// <param name="year">publication year</param>
        /// <param name="maxPrize">Max Prize</param>
        /// <param name="minPrize">Min prize</param>
        /// <param name="sort">Sorting order</param>
        /// <param name="page">Page</param>
        /// <returns>List of books</returns>
        [HttpGet("search")]
        public async Task<object> Index([FromQuery] string? authorName = "",
                                                [FromQuery] string phrase = "",
                                                [FromQuery] string[]? genre = default,
                                                [FromQuery] int[]? year = default,
                                                [FromQuery] int pageSize = 100,
                                                [FromQuery] SortType sort = default,
                                                [FromQuery] bool onlyOnPromotion = false,
                                                [FromQuery] decimal? maxPrize = 0,
                                                [FromQuery] decimal? minPrize = 0,
                                                [FromQuery] int page = 1)
        {
            var books = await _bookRepository.GetEBooks(genre?.ToList() ?? null, year?.ToList() ?? null, authorName);

            if (!string.IsNullOrEmpty(phrase))
            {
                books = books.Where(x => x.Title.Contains(phrase)).ToList();
            }

            if (onlyOnPromotion)
            {
                books = books.Where(x => x.Promotion != null && x.Promotion.EndDate > DateTime.Now).ToList();
            }

            books = books.Where(x => x.Prize >= minPrize).ToList();

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

            if (page <= 0)
            {
                page = 0;
            }
            else
            {
                page--;
            }

            var count = bookDtos.Count() - page * pageSize;

            if (count > pageSize)
            {
                return new { all = bookDtos.Count, page = page + 1, number_of_pages = bookDtos.Count / pageSize + 1, result = bookDtos.GetRange(page * pageSize, pageSize) };
            }
            else
            {
                return new { all = bookDtos.Count, page = page + 1, number_of_pages = bookDtos.Count / pageSize + 1, result = bookDtos.GetRange(page * pageSize, count) };
            }
        }

        /// <summary>
        ///     Get best sellers ( book with the biggest number of readers)
        /// </summary>
        /// <param name="pageSize">Books count on page</param>
        /// <param name="page">page</param>
        /// <returns>List of books</returns>
        [HttpGet("bestseller")]
        public async Task<object> BestSeller([FromQuery] int page, [FromQuery] int pageSize = 100)
        {
            var books = await _bookRepository.GetEBooks();
            var bookDtos = books.OrderBy(x => x.Readers.Count).ToDTOs().ToList();

            if (page <= 0)
            {
                page = 0;
            }
            else
            {
                page--;
            }

            var count = bookDtos.Count() - page * pageSize;

            if (count > pageSize)
            {
                return new { all = bookDtos.Count, page = page + 1, number_of_pages = bookDtos.Count / pageSize + 1, result = bookDtos.GetRange(page * pageSize, pageSize) };
            }
            else
            {
                return new { all = bookDtos.Count, page = page + 1, number_of_pages = bookDtos.Count / pageSize + 1, result = bookDtos.GetRange(page * pageSize, count) };
            }
        }

        /// <summary>
        ///     Put book on promotion
        /// </summary>
        /// <param name="id">Book id</param>
        /// <param name="promotion">Promotion data</param>
        /// <returns>List of books</returns>
        [HttpPost("{id}/promote")]
        public async Task<HttpStatusCode> Promote(Guid id, [FromBody] PromotionDto promotion)
        {
            var book = await _bookRepository.Get(id);

            if (book == null)
            {
                throw new BookNotFoundException(id.ToString());
            }

            book.Promotion = new Promotion()
            {
                StartDate = promotion.StartDate,
                EndDate = promotion.EndDate,
                Prize = promotion.Prize
            };

            await _bookRepository.SaveChanges();

            return HttpStatusCode.OK;
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
