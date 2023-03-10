﻿using Microsoft.AspNetCore.Identity;

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
        public override string? Email { get; set; }

        /// <summary>
        ///     Phone No
        /// </summary>
        public override string? PhoneNumber { get; set; }

        /// <summary>
        ///     Documents
        /// </summary>
        public virtual List<EBook>? Publications { get; set; }

        public virtual List<EBookReader> EBooks { get; set; }
    }
}
