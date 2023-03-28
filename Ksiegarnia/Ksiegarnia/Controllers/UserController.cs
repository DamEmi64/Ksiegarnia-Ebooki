using Domain.DTOs;
using Domain.Repositories;
using Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Net;
using System.Text;
using System.Text.Encodings.Web;

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
        private readonly IAuthService _authService;
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="userRepository"></param>
        public UserController(IUserRepository userRepository, IAuthService authService)
        {
            _userRepository = userRepository;
            _authService = authService;
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

        /// <summary>
        ///     Register
        /// </summary>
        /// <param name="data">register data</param>
        /// <returns></returns>
        [HttpPost("Register")]
        public async Task Register([FromBody] RegisterDto data)
        {
            var user = await _userRepository.Register(data, data.Password);
            var token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(user.Token));
            var callbackUrl = Url.Page(
                "/User/ConfirmEmail",
                pageHandler: null,
                values: new { area = "Identity", userId = user.Id, code = token },
                protocol: Request.Scheme);
            _authService.SendEmail($"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.", user.Email);
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
        public async Task SendToken(string id)
        {
            var user = await _userRepository.GeneratePasswordToken(id);
            var token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(user.Token));
            var callbackUrl = Url.Page(
                "/User/ConfirmEmail",
                pageHandler: null,
                values: new { area = "Identity", userId = user.Id, code = token },
                protocol: Request.Scheme);
            _authService.SendEmail($"Reset password by <a href='{HtmlEncoder.Default.Encode(callbackUrl)}'>clicking here</a>.", user.Email);
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
        /// <param name="passwordChange">Password change data</param>
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

        /// <summary>
        ///     Email verification link
        /// </summary>
        /// <param name="id">User id</param>
        /// <param name="token">Token</param>
        /// <returns></returns>
        [HttpGet("ConfirmEmail")]
        public async Task EmailConfirm(string id, [FromQuery] string token)
        {
            await _userRepository.Confirm(id, token);
        }
    }
}
