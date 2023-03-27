using Domain.DTOs;
using Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Application.Controllers
{
    /// <summary>
    ///     User Controller
    /// </summary>
    [Route("Users")]
    [ApiController]
    public class UserController : Controller
    {
        private readonly IUserRepository _userRepository;
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="userRepository"></param>
        public UserController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        /// <summary>
        ///     Get user by id
        /// </summary>
        /// <param name="id">id</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<UserDto> Details(string id)
        {
            return (await _userRepository.Get(id)).ToDTO();
        }

        // POST: UserController/Create
        [HttpPost("Register")]
        [ValidateAntiForgeryToken]
        public async Task<UserDto> Register([FromBody] RegisterDto user)
        {
            return (await _userRepository.Register(user, string.Empty)).ToDTO();
        }

        /// <summary>
        ///     Login
        /// </summary>
        /// <param name="data">Login data</param>
        /// <returns></returns>
        [HttpPost("login")]
        public async Task<UserDto> Login([FromBody] LoginDto data)
        {
            return (await _userRepository.Login(data.Email, data.Password)).ToDTO();
        }

        /// <summary>
        ///     Send refresh token (for password reset)
        /// </summary>
        /// <param name="id">user id</param>
        /// <returns></returns>
        [HttpGet("{id}/passwordResetToken")]
        [ValidateAntiForgeryToken]
        public Task<string> SendToken(string id)
        {
            return _userRepository.GeneratePasswordToken(id);
        }

        /// <summary>
        ///     Reset password
        /// </summary>
        /// <param name="id">user id</param>
        /// <param name="token">refresh token</param>
        /// <param name="newPassword">password</param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpPost("{id}/passwordReset")]
        public async Task PasswordReset(string id, [FromQuery] string token, [FromBody] string newPassword)
        {
            if (string.IsNullOrEmpty(token))
            {
                throw new Exception("Token is not found");
            }

            await _userRepository.ResetPassword(id, token, newPassword);
        }

        /// <summary>
        ///     Change password
        /// </summary>
        /// <param name="id">user id</param>
        /// <param name="token">refresh token</param>
        /// <param name="newPassword">password</param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpPost("{id}/passwordChange")]
        public async Task PasswordChange(string id, [FromBody] PasswordChangeDto passwordChange)
        {
            await _userRepository.ChangePassword(id, passwordChange.OldPassword, passwordChange.Password);
        }
        /// <summary>
        ///     Remove user by id
        /// </summary>
        /// <param name="id">user id</param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task Delete(string id)
        {
            await _userRepository.Remove(id);
        }
    }
}
