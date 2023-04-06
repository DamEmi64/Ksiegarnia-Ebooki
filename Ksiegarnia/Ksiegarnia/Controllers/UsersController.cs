using Domain.DTOs;
using Domain.Repositories;
using Infrastructure.Exceptions;
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
    public class UsersController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly IAuthService _authService;
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="userRepository"></param>
        public UsersController(IUserRepository userRepository, IAuthService authService)
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
            var user = await _userRepository.Get(id);

            if(user == null)
            {
                throw new UserNotFoundException(id);
            }

            return user.ToDTO();
        }

        /// <summary>
        ///     Register
        /// </summary>
        /// <param name="data">register data</param>
        /// <returns></returns>
        /// <exception cref="RegisterFailedException">when register fail...</exception>
        [HttpPost("Register")]
        public async Task<HttpStatusCode> Register([FromBody] RegisterDto data)
        {    
            try
            {
                var user = await _userRepository.Register(data, data.Password);
                var token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(user.Token));
                var callbackUrl = Url.Action("EmailConfirm", values: new { id = user.Id, token = token });
                _authService.SendEmail($"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl ?? string.Empty)}'>clicking here</a>.", user.Email);

            }
            catch (Exception)
            {
                throw new RegisterFailedException();
            }
            
            return HttpStatusCode.Created;
        }

        /// <summary>
        ///     Login
        /// </summary>
        /// <param name="data">Login data</param>
        /// <returns></returns>
        /// <exception cref="LoginFailedException">when login fail...</exception>
        [HttpPost("login")]
        public async Task<UserDto> Login([FromBody] LoginDto data)
        {
            var user = await _userRepository.Login(data.Email, data.Password);
            if (user == null)
            {
                throw new LoginFailedException();
            }

            return user.ToDTO();
        }

        /// <summary>
        ///     Send refresh token (for password reset)
        /// </summary>
        /// <param name="id">user id</param>
        /// <returns></returns>
        /// <exception cref="UserNotFoundException">when user not found...</exception>
        [HttpGet("{id}/passwordResetToken")]
        public async Task<HttpStatusCode> SendToken(string id)
        {
            var user = await _userRepository.GeneratePasswordToken(id);

            if (user == null)
            {
                throw new UserNotFoundException(id);
            }

            var token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(user.Token));
            var callbackUrl = Url.Action("EmailConfirm", values: new { id = user.Id, token = token });
            _authService.SendEmail($"Reset password by <a href='{HtmlEncoder.Default.Encode(callbackUrl ?? string.Empty)}'>clicking here</a>.", user.Email);

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Reset password
        /// </summary>
        /// <param name="id">user id</param>
        /// <param name="token">refresh token</param>
        /// <param name="newPassword">password</param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        /// <exception cref="TokenNotFoundException">when token is empty...</exception>
        [HttpPost("{id}/passwordReset")]
        public async Task PasswordReset(string id, [FromQuery] string token, [FromBody] string newPassword)
        {
            if (string.IsNullOrEmpty(token))
            {
                throw new TokenNotFoundException();
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
