namespace Domain.DTOs
{
    public class CreateBookDto
    {
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
        ///     Content (base64)
        /// </summary>
        public string? Content { get; set; }
    
        /// <summary>
        ///     Author
        /// </summary>
        public UserDto? Author { get; set; }

        /// <summary>
        ///     Book Picture
        /// </summary>
        public string? Picture { get; set; }

        /// <summary>
        ///     Book Prize
        /// </summary>
        public decimal? Prize { get; set; }
    }
}
