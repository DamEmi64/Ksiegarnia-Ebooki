using Domain.Entitites;

namespace Domain.DTOs
{
    /// <summary>
    ///     User Dto
    /// </summary>
    public class UserDto
    {
        /// <summary>
        ///      Id
        /// </summary>
        public string Id { get; set; } = string.Empty;

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

        /// <summary>
        ///     User age
        /// </summary>
        public int Age { get; set; }

        /// <summary>
        ///     User roles
        /// </summary>
        public IEnumerable<string>? Roles { get; set; }

        /// <summary>
        ///     User wallet
        /// </summary>
        public decimal Wallet { get; set; }
    }

    /// <summary>
    ///     User Convertion
    /// </summary>
    public static class UserConvert
    {
        /// <summary>
        ///     To Dto
        /// </summary>
        /// <param name="users">List of users</param>
        /// <returns></returns>
        public static IEnumerable<UserDto> ToDTOs(this List<User> users)
        {
            foreach (var user in users)
            {
                yield return user.ToDTO();
            }
        }

        /// <summary>
        ///     To Dto
        /// </summary>
        /// <param name="user">User</param>
        /// <param name="roles">User roles</param>
        /// <returns></returns>
        public static UserDto? ToDTO(this User user, IEnumerable<string>? roles = null)
        {
            if (user != null)
            {
                return new UserDto()
                {
                    FirstName = user.FirstName,
                    Email = user.Email,
                    Id = user.Id,
                    LastName = user.LastName,
                    Nick = user.Nick,
                    Phone = user.PhoneNumber,
                    Age = (int)(DateTime.UtcNow - user.BirthDate).TotalDays / 365,
                    Roles = roles,
                    Wallet = user.Wallet
                };
            }

            return null;
        }
    }
}
