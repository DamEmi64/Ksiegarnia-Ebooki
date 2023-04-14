using Domain.DTOs;
using Domain.Entitites;
using Domain.Enums;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Application.Controllers
{
    /// <summary>
    ///     Review Controller
    /// </summary>
    [Route("Review")]
    [ApiController]
    public class ReviewController : Controller
    {
        private readonly IReviewsRepository _reviewsRepository;
        private readonly IEBookReaderRepository _eBookReaderRepository;

        public ReviewController(IReviewsRepository reviewsRepository, IEBookReaderRepository eBookReaderRepository)
        {
            _reviewsRepository = reviewsRepository;
            _eBookReaderRepository = eBookReaderRepository;
        }

        /// <summary>
        ///     Get books list via paramereters
        /// </summary>
        /// <param name="authorName">Author name</param>
        /// <param name="pageSize">page size</param>
        /// <param name="phrase">search phrase</param>
        /// <param name="sort">Sorting order</param>
        /// <param name="page">Page</param>
        /// <returns>List of books</returns>
        [HttpGet("search")]
        public async Task<object> Index([FromQuery] string? authorName = "",
                                                [FromQuery] string phrase = "",
                                                [FromQuery] int pageSize = 100,
                                                [FromQuery] ReviewSortType sort = default,
                                                [FromQuery] int page = 1)
        {
            var reviews = await _reviewsRepository.GetReviews(Guid.Empty);

            if (!string.IsNullOrEmpty(authorName))
            {
                reviews = reviews.Where(x => x.Reader.User.Nick == authorName).ToList();
            }

            var bookDtos = sort switch
            {
                ReviewSortType.DescByDate => reviews.OrderByDescending(x => x.Date).ToDTOs().ToList(),
                ReviewSortType.DescByAuthor => reviews.OrderByDescending(x => x.Reader.User.Nick).ToDTOs().ToList(),
                ReviewSortType.AscByAuthor => reviews.OrderBy(x => x.Reader.User.Nick).ToDTOs().ToList(),
                ReviewSortType.AscByDate => reviews.OrderBy(x => x.Date).ToDTOs().ToList(),
                ReviewSortType.AscByStars => reviews.OrderBy(x => x.Grade).ToDTOs().ToList(),
                ReviewSortType.DescByStars => reviews.OrderByDescending(x => x.Grade).ToDTOs().ToList(),
                _ => reviews.OrderBy(x => x.Date).ToDTOs().ToList()
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
        ///     Get review details by id
        /// </summary>
        /// <param name="id">Ebook id</param>
        /// <returns>Ebook details</returns>
        [HttpGet("{id}")]
        public async Task<ReviewDto> Details(Guid? id)
        {
            return (await _reviewsRepository.Get(id ?? Guid.Empty)).ToDTO();
        }

        /// <summary>
        ///     Add Review
        /// </summary>
        /// <param name="genreDto">Genre data</param>
        /// <returns></returns>
        [HttpPost("")]
        public async Task<HttpStatusCode> Create([FromBody] ReviewDto reviewDto)
        {
            var reader = await _eBookReaderRepository.Get(reviewDto.Reviewer.Id,reviewDto.Book.Id);

            if (reader == null)
            {
                throw new UserNotFoundException(reviewDto.Reviewer.Id);
            }

            var review = new Review()
            {
                Id = Guid.NewGuid(),
                Reader = reader,
                Date = reviewDto.Date,
                Grade = reviewDto.Grade,
                Opinion = reviewDto.Opinion
            };

            await _reviewsRepository.Add(review);
            await _reviewsRepository.SaveChanges();

            return HttpStatusCode.Created;
        }

        /// <summary>
        ///     Edit Review
        /// </summary>
        /// <param name="id">Id</param>
        /// <param name="reviewDto">review Dto</param>
        /// <returns></returns>
        /// <exception cref="GenreNotFoundException"></exception>
        [HttpPut("{id}")]
        [ValidateAntiForgeryToken]
        public async Task<HttpStatusCode> Edit(Guid id, ReviewDto reviewDto)
        {
            var review = await _reviewsRepository.Get(id);
            if (review == null)
            {
                throw new BookReviewNotFound();
            }

            review.Opinion = reviewDto.Opinion;
            review.Date = reviewDto.Date;
            review.Opinion = reviewDto.Opinion;

            await _reviewsRepository.SaveChanges();

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Delete Review
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns></returns>
        /// <exception cref="GenreNotFoundException">When genre not found...</exception>
        [HttpDelete("{id}")]
        public async Task<HttpStatusCode> Delete(Guid id)
        {
            var review = await _reviewsRepository.Get(id);
            if (review == null)
            {
                throw new BookReviewNotFound();
            }

            await _reviewsRepository.Remove(id);

            await _reviewsRepository.SaveChanges();

            return HttpStatusCode.OK;
        }
    }
}
