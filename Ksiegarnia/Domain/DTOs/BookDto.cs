using Domain.Entitites;

namespace Domain.DTOs
{
    public class BookDto
    {
        /// <summary>
        ///     Book Id
        /// </summary>
        public Guid Id { get; set; } = Guid.Empty;
        /// <summary>
        ///     Title
        /// </summary>
        public string? Title { get; set; }

        /// <summary>
        ///     Genre
        /// </summary>
        public GenreDto? Genre { get; set; }

        /// <summary>
        ///     Description
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        ///     PageNumber
        /// </summary>
        public int? PageNumber { get; set; }
        /// <summary>
        /// User simplified data 
        /// </summary>
        public UserDto? Author { get; set; }

        /// <summary>
        ///     Book picture / cover
        /// </summary>
        public byte[]? Picture { get; set; }

        /// <summary>
        ///     Prize
        /// </summary>
        public decimal? Prize { get; set; }

        /// <summary>
        ///     Promotion
        /// </summary>
        public PromotionDto? Promotion { get; set; }

        /// <summary>
        ///     Distinction
        /// </summary>
        public DistinctionDto? Distinction { get; set; }

        /// <summary>
        ///     Verification status
        /// </summary>
        public string? VerificationStatus { get; set; }

        /// <summary>
        ///     Grade
        /// </summary>
        public decimal? Grade { get; set; }
    }

    /// <summary>
    ///     Convert to dto
    /// </summary>
    public static class BookConvert
    {
        public static IEnumerable<BookDto> ToDTOs(this IEnumerable<EBook> eBooks)
        {
            foreach (var book in eBooks)
            {
                yield return book.ToDTO();
            }
        }

        public static BookDto ToDTO(this EBook eBook)
        {
            PromotionDto promotion = null;

            if (eBook.Promotion != null)
            {
                promotion = new PromotionDto
                {
                    IsPremiumOnly = eBook.Promotion?.OnlyForPremium ?? false,
                    StartDate = eBook.Promotion?.StartDate ?? default,
                    EndDate = eBook.Promotion?.EndDate ?? default,
                    PremiumPrize = eBook.Promotion?.PremiumPrize ?? default,
                    Prize = eBook.Promotion?.Prize ?? default
                };
            }

            DistinctionDto distinction = null;

            if (eBook.Distinction != null)
            {
                distinction = new DistinctionDto
                {
                    StartDate = eBook.Distinction?.StartDate ?? default,
                    HowLong = eBook.Distinction?.HowLong ?? 0,
                };
            }

            decimal grade = 0;

            if (eBook.Readers != null && eBook.Readers.Count > 0)
            {
                int i = 0;
                foreach (var reader in eBook.Readers)
                {
                    var review = reader.Reviews.LastOrDefault(x => x.Reader.EBook.Id == eBook.Id);

                    if (review != null)
                    {
                        i++;
                        grade += review.Grade;
                    }
                }

                if (i > 0)
                {
                    grade /= i;
                }

            }


            return new BookDto()
            {
                Id = eBook.Id,
                Genre = eBook.Genre.ToDTO(),
                Title = eBook.Title,
                Description = eBook.Description,
                PageNumber = eBook.PageNumber,
                Author = eBook.Author.ToDTO(),
                Prize = eBook.Prize,
                Picture = eBook.Picture,
                Promotion = promotion,
                Distinction = distinction,
                VerificationStatus = eBook.Verification.ToString(),
                Grade = grade
            };
        }
    }
}
