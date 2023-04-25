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
        ///     Admin email
        /// </summary>
        [EmailAddress]
        public string AdminEmail { get; set; }

        /// <summary>
        ///     Admin password
        /// </summary>
        public string AdminPassword { get; set; }

        /// <summary>
        ///     Premium email
        /// </summary>
        [EmailAddress]
        public string? PremiumEmail { get; set; }

        /// <summary>
        ///     Premium password
        /// </summary>
        public string? PremiumPassword { get; set; }

        /// <summary>
        ///      Email
        /// </summary>
        [EmailAddress]
        public string? Email { get; set; }

        /// <summary>
        ///     Password
        /// </summary>
        public string? Password { get; set; }

        /// <summary>
        ///     Number of generated books
        /// </summary>
        public int BookNo { get; set; }
    }
}
