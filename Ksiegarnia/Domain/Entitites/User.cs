using Microsoft.AspNetCore.Identity;

namespace Domain.Entitites
{
    /// <summary>
    ///     User
    /// </summary>
    public class User : IdentityUser
    {
        /// <summary>
        ///     First name
        /// </summary>
        public string? FirstName { get; set; }

        /// <summary>
        ///     Last name
        /// </summary>
        public string? LastName { get; set; }

        /// <summary>
        ///     Email
        /// </summary>
        public override string Email { get; set; } = string.Empty;

        /// <summary>
        ///     Phone No
        /// </summary>
        public override string? PhoneNumber { get; set; }

        /// <summary>
        ///     User name
        /// </summary>
        public string Nick { get; set; } = string.Empty;

        /// <summary>
        ///     Documents
        /// </summary>
        public virtual List<EBook>? Publications { get; set; } = new();

        /// <summary>
        ///  Buyed books
        /// </summary>
        public virtual List<EBookReader> EBooks { get; set; } = new();

        /// <summary>
        ///     User birth date
        /// </summary>
        public DateTime BirthDate { get; set; }

        /// <summary>
        ///     Number of owned distinctions
        /// </summary>
        public int Distinctions { get; set; }

        /// <summary>
        ///     Information about hiding personal data
        /// </summary>
        public HideInfo? HideInfo { get; set; }

        /// <summary>
        ///     Inside wallet
        /// </summary>
        public decimal Wallet { get; set; }
    }
}
