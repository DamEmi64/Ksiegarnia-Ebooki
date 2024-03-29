﻿using Microsoft.AspNetCore.Mvc;
using Domain.Entitites;
using Domain.Repositories;
using System.Net;
using Domain.DTOs;
using Domain.Enums;
using Infrastructure.Exceptions;
using Newtonsoft.Json;
using Infrastructure;

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
        private readonly IHostEnvironment _environment;

        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="repository">Repo</param>
        /// <param name="userRepository"></param>
        /// <param name="genreRepository"></param>
        /// <param name="environment"></param>
        public EBooksController(IEBookRepository repository, IUserRepository userRepository, IGenreRepository genreRepository, IHostEnvironment environment)
        {
            _bookRepository = repository;
            _userRepository = userRepository;
            _genreRepository = genreRepository;
            _environment = environment;
        }

        /// <summary>
        ///     Get books list via paramereters
        /// </summary>
        /// <param name="authorName">Author name</param>
        /// <param name="genre">Genre (names)</param>
        /// <param name="onlyOnPromotion">Only books on promotion</param>
        /// <param name="pageSize">page size</param>
        /// <param name="phrase">search phrase</param>
        /// <param name="year">publication year</param>
        /// <param name="maxPrize">Max Prize</param>
        /// <param name="minPrize">Min prize</param>
        /// <param name="onlyVerified">show only verified</param>
        /// <param name="sort">Sorting order</param>
        /// <param name="page">Page</param>
        /// <returns>List of books</returns>
        [HttpGet("search")]
        public async Task<object> Index([FromQuery] string? authorName = "",
                                                [FromQuery] string? phrase = "",
                                                [FromQuery] string[]? genre = default,
                                                [FromQuery] int[]? year = default,
                                                [FromQuery] int pageSize = 100,
                                                [FromQuery] SortType sort = default,
                                                [FromQuery] bool onlyOnPromotion = false,
                                                [FromQuery] decimal? maxPrize = 0,
                                                [FromQuery] decimal? minPrize = 0,
                                                [FromQuery] VerificationType? verificationType = null,
                                                [FromQuery] int page = 1)
        {
            var books = await _bookRepository.GetEBooks(genre?.ToList() ?? null, year?.ToList() ?? null, authorName ?? string.Empty);

            if (maxPrize > 0)
            {
                books = books.Where(x => x.Prize <= maxPrize).ToList();
            }
            if (minPrize > 0)
            {
                books = books.Where(x => x.Prize >= minPrize).ToList();
            }

            if (verificationType != null)
            {
                books = books.Where(x => x.Verification == verificationType).ToList();
            }

            if (!string.IsNullOrEmpty(phrase))
            {
                books = books.Where(x => x.Title.Contains(phrase) || x.Author.Nick.Contains(phrase)).ToList();
            }

            if (onlyOnPromotion)
            {
                books = books.Where(x => x.Promotion != null && x.Promotion.EndDate > DateTime.Now).ToList();
            }

            var bookDtos = sort switch
            {
                SortType.DescByPrize => books.OrderByDescending(x => x.Prize).ThenBy(x => x.Distinction != null && x.Distinction.StartDate.AddDays(7) > DateTime.Now).ToDTOs().ToList(),
                SortType.DescByGenre => books.OrderByDescending(x => x.Genre).ThenBy(x => x.Distinction != null && x.Distinction.StartDate.AddDays(7) > DateTime.Now).ToDTOs().ToList(),
                SortType.DescByDate => books.OrderByDescending(x => x.Prize).ThenBy(x => x.Distinction != null && x.Distinction.StartDate.AddDays(7) > DateTime.Now).ToDTOs().ToList(),
                SortType.DescByAuthor => books.OrderByDescending(x => x.Author.Nick).ThenBy(x => x.Distinction != null && x.Distinction.StartDate.AddDays(7) > DateTime.Now).ToDTOs().ToList(),
                SortType.AscByAuthor => books.OrderBy(x => x.Author.Nick).ThenBy(x => x.Distinction != null && x.Distinction.StartDate.AddDays(7) > DateTime.Now).ToDTOs().ToList(),
                SortType.AscByDate => books.OrderBy(x => x.Date).ThenBy(x => x.Distinction != null && x.Distinction.StartDate.AddDays(7) > DateTime.Now).ToDTOs().ToList(),
                SortType.AscByGenre => books.OrderBy(x => x.Genre.Name).ThenBy(x => x.Distinction != null && x.Distinction.StartDate.AddDays(7) > DateTime.Now).ToDTOs().ToList(),
                SortType.AscByPrize => books.OrderBy(x => x.Prize).ThenBy(x => x.Distinction != null && x.Distinction.StartDate.AddDays(7) > DateTime.Now).ToDTOs().ToList(),
                SortType.DescByName => books.OrderByDescending(x => x.Title).ThenBy(x => x.Distinction != null && x.Distinction.StartDate.AddDays(7) > DateTime.Now).ToDTOs().ToList(),
                SortType.AscByName => books.OrderBy(x => x.Title).ThenBy(x => x.Distinction != null && x.Distinction.StartDate.AddDays(7) > DateTime.Now).ToDTOs().ToList(),
                SortType.BestSeller => books.OrderBy(x => x.Readers.Count).ThenBy(x => x.Distinction != null && x.Distinction.StartDate.AddDays(7) > DateTime.Now).ToDTOs().ToList(),
                _ => books.OrderBy(x => x.Title).ThenBy(x => x.Distinction != null && x.Distinction.StartDate.AddDays(7) > DateTime.Now).ToDTOs().ToList()
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
        ///     Distinct Book
        /// </summary>
        /// <param name="id">Book id</param>
        /// <param name="distinction">Distinction data</param>
        /// <returns>List of books</returns>
        [HttpPost("{id}/distinct")]
        public async Task<HttpStatusCode> Distinct(Guid id, [FromBody] DistinctionDto distinction)
        {
            var user = await _userRepository.GetByNick(User.Identity?.Name ?? string.Empty);
            var book = await _bookRepository.Get(id);

            if (book == null)
            {
                throw new BookNotFoundException(id.ToString());
            }

            if (user == null)
            {
                throw new UserNotFoundException(string.Empty);
            }

            if (book.Author != user || user.Distinctions <= 0)
            {
                if (!(await _userRepository.CheckRole(user?.Id ?? "", Roles.PremiumUser) || await _userRepository.CheckRole(user?.Id ?? "", Roles.Admin)))
                {
                    throw new FreeBonusUsedException();
                }
                else
                {
                    if (await _userRepository.CheckRole(user?.Id ?? string.Empty, Roles.PremiumUser) && (await CountFreeDistinctions(user)) < user?.Publications?.Count(x => x.Promotion != null))
                    {
                        throw new PremiumBonusUsedException();
                    }
                }
            }

            book.Distinction = new Distinction()
            {
                StartDate = distinction.StartDate,
                HowLong = distinction.HowLong,
                Id = Guid.NewGuid(),
                Book = book
            };

            await _bookRepository.AddDistinction(book.Distinction);

            book.Author.Distinctions--;

            await _bookRepository.SaveChanges();

            return HttpStatusCode.OK;
        }


        /// <summary>
        ///     Get gift tokens (5)
        /// </summary>
        /// <param name="id">Book id</param>
        /// <returns>List of books</returns>
        [HttpGet("{id}/tokens")]
        public async Task<List<string>?> Token(Guid id)
        {
            var book = await _bookRepository.Get(id);

            if (book == null)
            {
                throw new BookNotFoundException(id.ToString());
            }

            if (string.IsNullOrEmpty(book.Tokens))
            {
                var list = new List<string>();
                for (int i = 0; i < 5; i++)
                {
                    var bytes = new byte[64];
                    Random.Shared.NextBytes(bytes);
                    list.Add(Convert.ToBase64String(bytes));
                }

                book.Tokens = JsonConvert.SerializeObject(list);
            }
            else
            {
                var list = JsonConvert.DeserializeObject<List<string>>(book.Tokens);

                if (list != null)
                {
                    for (int i = list.Count; i < 6; i++)
                    {
                        var bytes = new byte[64];
                        Random.Shared.NextBytes(bytes);
                        list.Add(Convert.ToBase64String(bytes));
                    }

                    book.Tokens = JsonConvert.SerializeObject(list);
                }
            }

            await _bookRepository.SaveChanges();

            return JsonConvert.DeserializeObject<List<string>>(book.Tokens);
        }

        /// <summary>
        ///     Put book on promotion (free user have 10 promotion)
        /// </summary>
        /// <param name="id">Book id</param>
        /// <param name="promotion">Promotion data</param>
        /// <returns>List of books</returns>
        [HttpPost("{id}/promote")]
        public async Task<HttpStatusCode> Promote(Guid id, [FromBody] PromotionDto promotion)
        {
            var user = await _userRepository.GetByNick(User.Identity?.Name ?? String.Empty);
            var book = await _bookRepository.Get(id);

            if (book == null)
            {
                throw new BookNotFoundException(id.ToString());
            }

            book.Promotion = new Promotion()
            {
                StartDate = promotion.StartDate ?? default,
                EndDate = promotion.EndDate ?? default,
                Prize = promotion.Prize,
                OnlyForPremium = promotion.IsPremiumOnly
            };

            await _bookRepository.AddPromotion(book.Promotion);

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

            if (ebook.Verification != VerificationType.Accepted)
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
        public async Task<HttpStatusCode> Create([FromBody] CreateBookDto eBook)
        {
            if (ModelState.IsValid)
            {
                var author = await _userRepository.Get(eBook.Author?.Id ?? string.Empty);
                if (author == null)
                {
                    throw new UserNotFoundException(eBook?.Author?.Id ?? string.Empty);
                }

                if (await _bookRepository.CheckIfExist(Convert.FromBase64String(eBook.Content ?? string.Empty)))
                {
                    throw new BookHasThisContentException(eBook.Title ?? string.Empty);
                }

                var genre = await _genreRepository.Get(eBook.Genre?.Id ?? Guid.Empty);

                if (genre == null)
                {
                    throw new GenreNotFoundException();
                }

                if ((await _bookRepository.GetEBooks(AuthorName: author.Nick)).Count >= 10
                    && !((await _userRepository.CheckRole(author.Id, Roles.PremiumUser)) || (await _userRepository.CheckRole(author.Id, Roles.Admin))))
                {
                    throw new FreeBonusUsedException();
                }

                var book = new EBook()
                {
                    Id = Guid.NewGuid(),
                    Author = author,
                    Content = Convert.FromBase64String(eBook.Content ?? string.Empty),
                    Description = eBook.Description ?? string.Empty,
                    PageNumber = eBook.PageNumber ?? 0,
                    Title = eBook.Title ?? string.Empty,
                    Date = DateTime.UtcNow,
                    Picture = Convert.FromBase64String(eBook.Picture ?? string.Empty),
                    Genre = genre,
                    Prize = eBook.Prize ?? 0,
                    Verification = VerificationType.Verifing
                };

                    book.Verification = VerificationType.Accepted;

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
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        [HttpPut("{id}")]
        public async Task<HttpStatusCode> Edit(CreateBookDto eBook, Guid id)
        {
            if (ModelState.IsValid)
            {
                var book = await _bookRepository.Get(id);

                if (book == null)
                {
                    throw new BookNotFoundException(id.ToString());
                }

                if (eBook.Content != null)
                {
                    book.Content = Convert.FromBase64String(eBook.Content);
                    book.Verification = VerificationType.Verifing;
                }

                if (eBook.Description != null)
                {
                    book.Description = eBook.Description;
                }

                if (eBook.Title != null)
                {
                    book.Title = eBook.Title;
                }

                var newGenre = await _genreRepository.Get(eBook.Genre?.Id ?? Guid.Empty);

                if (newGenre != null)
                {
                    book.Genre = newGenre;
                }

                if (eBook.Prize != null)
                {
                    book.Prize = eBook.Prize ?? 0;
                }

                if (!string.IsNullOrEmpty(eBook.Picture))
                {
                    book.Picture = Convert.FromBase64String(eBook.Picture);
                }

                if (eBook.PageNumber != null)
                {
                    book.PageNumber = eBook.PageNumber ?? 0;
                }

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

                    await _bookRepository.SaveChanges();

                    return HttpStatusCode.OK;
                }
            }

            throw new BookNotFoundException(id);
        }


        private async Task<int> CountFreeDistinctions(User? user)
        {
            return (await _userRepository.GetPremium(user.Id))?.DaysToFinishPremium / 30 ?? 0 + user.Distinctions;
        }
    }
}
