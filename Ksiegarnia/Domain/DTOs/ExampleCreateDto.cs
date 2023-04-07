using System.ComponentModel.DataAnnotations;

namespace Domain.DTOs
{
    public class ExampleCreateDto
    {
        /// <summary>
        ///     Access token for create example
        /// </summary>
        [Required]
        public Guid Token { get; set; }

        /// <summary>
        ///     Default Admin email
        /// </summary>
        [EmailAddress]
        public string Email { get; set; }

        /// <summary>
        ///     Default Admin password
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        ///     Number of generated books
        /// </summary>
        public int BookNo { get; set; }
    }
}
