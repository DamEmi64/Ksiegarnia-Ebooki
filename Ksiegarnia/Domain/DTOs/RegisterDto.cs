namespace Domain.DTOs
{
    public class RegisterDto
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
        public string? Email { get; set; }

        /// <summary>
        ///     Phone No
        /// </summary>
        public string? PhoneNumber { get; set; }
        
        /// <summary>
        /// Password
        /// </summary>
        public string? Password { get; set; }

        /// <summary>
        ///     Username
        /// </summary>
        public string Nick { get; set; }
    }
}
