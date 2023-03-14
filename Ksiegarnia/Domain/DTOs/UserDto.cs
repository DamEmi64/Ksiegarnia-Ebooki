using Domain.Entitites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.DTOs
{
    public class UserDto
    {
        /// <summary>
        ///     User Id
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        ///     User nickname
        /// </summary>
        public string? Nick { get; set; }

        /// <summary>
        ///     User first name
        /// </summary>
        public string? FirstName { get; set; }

        /// <summary>
        ///     User last name
        /// </summary>
        public string? LastName { get; set; }

        /// <summary>
        ///     User email
        /// </summary>
        public string? Email { get; set; }
        
        /// <summary>
        ///     User phone number
        /// </summary>
        public string? Phone { get; set; }
    }

    public static class UserConvert
    {
        public static UserDto ToDTO ( this User  user)
        {
            return new UserDto()
            {
                FirstName = user.FirstName,
                Email = user.Email,
                Id = user.Id,
                LastName = user.LastName,
                Nick = user.Nick,
                Phone = user.PhoneNumber
            };
        }
    }
}
