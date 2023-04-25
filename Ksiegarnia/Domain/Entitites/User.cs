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
        public override string Email { get; set; }

        /// <summary>
        ///     Phone No
        /// </summary>
        public override string? PhoneNumber { get; set; }

        /// <summary>
        ///     User name
        /// </summary>
        public string Nick { get; set; }

        /// <summary>
        ///     Documents
        /// </summary>
        public virtual List<EBook>? Publications { get; set; }

        /// <summary>
        ///  Buyed books
        /// </summary>
        public virtual List<EBookReader> EBooks { get; set; }

        /// <summary>
        ///     Premium
        /// </summary>
        public Premium? Premium { get; set; }

        /// <summary>
        ///     User birth date
        /// </summary>
        public DateTime BirthDate { get; set; }

        public HideInfo? HideInfo { get; set; }
    }
}
