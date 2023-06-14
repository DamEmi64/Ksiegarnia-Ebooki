using Domain.Entitites;

namespace Domain.DTOs
{
    public class ReviewDto
    {
        public Guid Id { get; set; }

        public DateTime Date { get; set; }

        public BookDto Book { get; set; }

        public UserDto Reviewer { get; set; }

        public string Opinion { get; set; }

        public decimal Grade { get; set; }
    }

    public static class ReviewConvert
    {
        public static IEnumerable<ReviewDto> ToDTOs(this IEnumerable<Review> reviews)
        {
            foreach (var review in reviews)
            {
                yield return review.ToDTO();
            }
        }

        public static ReviewDto ToDTO(this Review review)
        {
            return new()
            {
                Id = review.Id,
                Date = review.Date,
                Book = review.Reader?.EBook.ToDTO(),
                Reviewer = review.Reader.User.ToDTO(),
                Opinion = review.Opinion,
                Grade = review.Grade
            };
        }
    }
}
