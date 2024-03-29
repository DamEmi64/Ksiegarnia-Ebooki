﻿using Domain.DTOs;
using Domain.Entitites;
using Domain.Enums;
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
        private readonly ISmtpService _authService;
        private readonly IHostEnvironment _environment;
        private readonly IEBookRepository _eBookRepository;
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="userRepository"></param>
        /// <param name="authService"></param>
        /// <param name="environment"></param>
        /// <param name="eBookRepository"></param>
        public UsersController(IUserRepository userRepository, ISmtpService authService, IHostEnvironment environment, IEBookRepository eBookRepository)
        {
            _userRepository = userRepository;
            _authService = authService;
            _environment = environment;
            _eBookRepository = eBookRepository;
        }

        /// <summary>
        ///     Search users
        /// </summary>
        /// <param name="phrase">Phrase</param>
        /// <returns></returns>
        [HttpGet("search")]
        public async Task<object> Search([FromQuery] string? phrase)
        {
            if (string.IsNullOrEmpty(phrase))
            {
                return (await _userRepository.GetUsers());
            }

            return (await _userRepository.GetUsers()).Where(x => x.Nick.Contains(phrase));
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

            if (user == null)
            {
                throw new UserNotFoundException(id);
            }

            return await HideData(user.ToDTO(await _userRepository.GetRoles(user.Id)), user);
        }

        /// <summary>
        ///     Get user ebooks by id
        /// </summary>
        /// <param name="id">id</param>
        /// <param name="page">page</param>
        /// <param name="pageSize">page size</param>
        /// <param name="sort">sort type</param>
        /// <param name="author">author</param>
        /// <param name="title">title</param>
        /// <returns></returns>
        [HttpGet("{id}/ebooks")]
        public async Task<object> Ebooks(string id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 100,
            [FromQuery] SortType sort = SortType.DescByName,
            [FromQuery] string? author = null,
            [FromQuery] string? title = null)
        {
            var user = await _userRepository.Get(id);

            if (user == null)
            {
                throw new UserNotFoundException(id);
            }

            var books = (await _eBookRepository.GetEBooks()).Where(x => x.Readers != null && x.Readers.Any(y => y.User.Id == user.Id && y.Transaction != null && y.Transaction.Finished)).ToList();

            if (books == null)
            {
                return new { all = 0 };
            }

            var list = sort switch
            {
                SortType.DescByPrize => books.OrderByDescending(x => x.Prize).ToDTOs().ToList(),
                SortType.DescByGenre => books.OrderByDescending(x => x.Genre).ToDTOs().ToList(),
                SortType.DescByDate => books.OrderByDescending(x => x.Prize).ToDTOs().ToList(),
                SortType.DescByAuthor => books.OrderByDescending(x => x.Author.Nick).ToDTOs().ToList(),
                SortType.AscByAuthor => books.OrderBy(x => x.Author.Nick).ToDTOs().ToList(),
                SortType.AscByDate => books.OrderBy(x => x.Date).ToDTOs().ToList(),
                SortType.AscByGenre => books.OrderBy(x => x.Genre.Name).ToDTOs().ToList(),
                SortType.AscByPrize => books.OrderBy(x => x.Prize).ToDTOs().ToList(),
                SortType.DescByName => books.OrderByDescending(x => x.Title).ToDTOs().ToList(),
                SortType.AscByName => books.OrderBy(x => x.Title).ToDTOs().ToList(),
                _ => books.OrderBy(x => x.Title).ToDTOs().ToList()
            };

            if (!string.IsNullOrEmpty(title))
            {
                list = list.Where(x => x.Title.Contains(title)).ToList();
            }

            if (!string.IsNullOrEmpty(author))
            {
                list = list.Where(x => x.Author.Nick != null && x.Author.Nick.Contains(author)).ToList();
            }

            if (page <= 0)
            {
                page = 0;
            }
            else
            {
                page--;
            }

            var count = list.Count() - page * pageSize;

            if (count > pageSize)
            {
                return new { all = list.Count, page = page + 1, number_of_pages = list.Count / pageSize + 1, result = list.GetRange(page * pageSize, pageSize) };
            }
            else
            {
                return new { all = list.Count, page = page + 1, number_of_pages = list.Count / pageSize + 1, result = list.GetRange(page * pageSize, count) };
            }
        }

        /// <summary>
        ///     Get user publications by id
        /// </summary>
        /// <param name="id">id</param>
        /// <param name="page">page</param>
        /// <param name="pageSize">page size</param>
        /// <param name="title">title</param>
        /// <param name="sort">sort type</param>
        /// <returns></returns>
        [HttpGet("{id}/publications")]
        public async Task<object> Publications(string id,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 100,
            [FromQuery] SortType sort = SortType.DescByName,
            [FromQuery] string? title = null)
        {
            var user = await _userRepository.Get(id);

            if (user == null)
            {
                throw new UserNotFoundException(id);
            }

            var books = await _eBookRepository.GetEBooks(AuthorName: user.Nick);

            if (books == null)
            {
                return new { all = 0 };
            }

            var list = sort switch
            {
                SortType.DescByPrize => books.OrderByDescending(x => x.Prize).ThenBy(x => x.Distinction != null).ToDTOs().ToList(),
                SortType.DescByGenre => books.OrderByDescending(x => x.Genre).ThenBy(x => x.Distinction != null).ToDTOs().ToList(),
                SortType.DescByDate => books.OrderByDescending(x => x.Prize).ThenBy(x => x.Distinction != null).ToDTOs().ToList(),
                SortType.DescByAuthor => books.OrderByDescending(x => x.Author.Nick).ThenBy(x => x.Distinction != null).ToDTOs().ToList(),
                SortType.AscByAuthor => books.OrderBy(x => x.Author.Nick).ThenBy(x => x.Distinction != null).ToDTOs().ToList(),
                SortType.AscByDate => books.OrderBy(x => x.Date).ThenBy(x => x.Distinction != null).ToDTOs().ToList(),
                SortType.AscByGenre => books.OrderBy(x => x.Genre.Name).ThenBy(x => x.Distinction != null).ToDTOs().ToList(),
                SortType.AscByPrize => books.OrderBy(x => x.Prize).ThenBy(x => x.Distinction != null).ToDTOs().ToList(),
                SortType.DescByName => books.OrderByDescending(x => x.Title).ThenBy(x => x.Distinction != null).ToDTOs().ToList(),
                SortType.AscByName => books.OrderBy(x => x.Title).ThenBy(x => x.Distinction != null).ToDTOs().ToList(),
                _ => books.OrderBy(x => x.Title).ThenBy(x => x.Distinction != null).ToDTOs().ToList()
            };

            if (!string.IsNullOrEmpty(title))
            {
                list = list.Where(x => x.Title.Contains(title)).ToList();
            }
            if (!string.IsNullOrEmpty(title))
            {
                list = list.Where(x => x.Title.Contains(title)).ToList();
            }

            if (page <= 0)
            {
                page = 0;
            }
            else
            {
                page--;
            }

            var count = list.Count() - page * pageSize;

            if (count > pageSize)
            {
                return new { all = list.Count, page = page + 1, number_of_pages = list.Count / pageSize + 1, result = list.GetRange(page * pageSize, pageSize) };
            }
            else
            {
                return new { all = list.Count, page = page + 1, number_of_pages = list.Count / pageSize + 1, result = list.GetRange(page * pageSize, count) };
            }
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
            if (DateTime.UtcNow.Year - data.BirthDate.Year < 18)
            {
                throw new ExceptionBase(HttpStatusCode.BadRequest, "Too young.");
            }

            try
            {
                var user = await _userRepository.Register(data, data.Password ?? String.Empty);
                var token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(user.Token));
                var callbackUrl = Url.Action("EmailConfirm", "Users", new { id = user.Id, token = user.Token }, HttpContext.Request.Scheme, HttpContext.Request.Host.Value);

                    _authService.SendEmail($"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(callbackUrl ?? string.Empty)}'>clicking here</a>.", user.Email);

                // await _userRepository.Confirm(user.Id, user.Token);
            }
            catch (Exception)
            {
                throw new RegisterFailedException();
            }

            return HttpStatusCode.Created;
        }

        /// <summary>
        ///     Update
        /// </summary>
        /// <param name="data">register data</param>
        /// <param name="id">user id</param>
        /// <returns></returns>
        /// <exception cref="RegisterFailedException">when register fail...</exception>
        [HttpPut("{id}")]
        public async Task<HttpStatusCode> Update([FromBody] RegisterDto data, string id)
        {
            var user = await _userRepository.Get(id);

            if (user == null)
            {
                throw new UserNotFoundException(id);
            }

            user.PhoneNumber = data.PhoneNumber;
            user.FirstName = data.FirstName;
            user.LastName = data.LastName;
            user.Nick = data.Nick ?? string.Empty;

            if (data.HideInfo != null)
            {
                user.HideInfo = new HideInfo()
                {
                    Age = data.HideInfo.Age,
                    Email = data.HideInfo.Email,
                    FirstName = data.HideInfo.Email,
                    LastName = data.HideInfo.LastName,
                    Phone = data.HideInfo.Phone
                };
            }

            await _userRepository.Update(user);

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Get user distinction
        /// </summary>
        /// <returns></returns>
        [HttpGet("Distinction")]
        public async Task<object?> GetDistinction()
        {
            var user = await _userRepository.GetByNick(User?.Identity?.Name ?? string.Empty);

            if (user != null)
            {
                var distinctions = user.Publications?.Where(x => x.Distinction != null && x.Distinction.StartDate.AddDays(x.Distinction.HowLong) < DateTime.Now).ToDTOs();

                return new { Distinctions = distinctions, UsedDistinctions = distinctions.Count(), ownedDistinction = user.Distinctions };
            }

            return null;
        }

        /// <summary>
        ///     Get current user
        /// </summary>
        /// <returns></returns>
        [HttpGet("")]
        public async Task<UserDto?> GetCurrentUser()
        {
            var user = await _userRepository.GetByNick(User?.Identity?.Name ?? string.Empty);

            if (user != null)
            {
                return user.ToDTO(await _userRepository.GetRoles(user.Id));
            }

            return null;
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

            return user.ToDTO(await _userRepository.GetRoles(user.Id));
        }


        /// <summary>
        ///     Logout
        /// </summary>
        /// <returns></returns>
        /// <exception cref="LoginFailedException">when login fail...</exception>
        [HttpPost("logout")]
        public async Task<HttpStatusCode> Logout()
        {
            await _userRepository.Logout();

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Check is password correct
        /// </summary>
        /// <param name="id"></param>
        /// <param name="Password"></param>
        /// <returns></returns>
        [HttpPost("CheckPassword")]
        public async Task<HttpStatusCode> CheckPassword([FromQuery] string id, [FromBody] string password)
        {
            if (await _userRepository.CheckPassword(password, id))
            {
                return HttpStatusCode.OK;
            }

            return HttpStatusCode.BadRequest;
        }
        /// <summary>
        ///     Send refresh token (for password reset)
        /// </summary>
        /// <param name="email">user email</param>
        /// <returns></returns>
        /// <exception cref="UserNotFoundException">when user not found...</exception>
        [HttpGet("{email}/passwordResetToken")]
        public async Task<HttpStatusCode> SendToken(string email)
        {
            var user = await _userRepository.GeneratePasswordToken(email);

            if (user == null)
            {
                throw new UserNotFoundException(email);
            }

            //  var callbackUrl = Url.Action("EmailConfirm", values: new { id = user.Id, token = token });
            _authService.SendEmail($"Reset password by using this token:{user.Token}", user.Email);

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Reset password
        /// </summary>
        /// <param name="email">user email</param>
        /// <param name="token">refresh token</param>
        /// <param name="newPassword">password</param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        /// <exception cref="TokenNotFoundException">when token is empty...</exception>
        [HttpPost("{email}/passwordReset")]
        public async Task PasswordReset(string email, [FromQuery] string token, [FromBody] string newPassword)
        {
            if (string.IsNullOrEmpty(token))
            {
                throw new TokenNotFoundException();
            }

            await _userRepository.ResetPassword(email, token, newPassword);
        }

        /// <summary>
        ///     Send refresh token (for email change)
        /// </summary>
        /// <param name="id">user id</param>
        /// <returns></returns>
        /// <exception cref="UserNotFoundException">when user not found...</exception>
        [HttpGet("{id}/emailToken")]
        public async Task<HttpStatusCode> SendEmailToken(string id, [FromQuery] string newEmail)
        {
            var user = await _userRepository.ChangeEmailToken(id, newEmail);

            if (user == null)
            {
                throw new UserNotFoundException(id);
            }

            //   var callbackUrl = Url.Action("EmailChange", values: new { id = user.Id, token = token, newEmail = newEmail });
            _authService.SendEmail($"Change Email by using this token:{user.Token}", newEmail);

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Change email
        /// </summary>
        /// <param name="id">user id</param>
        /// <param name="token">refresh token</param>
        /// <param name="newEmail">email</param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        /// <exception cref="TokenNotFoundException">when token is empty...</exception>
        [HttpPost("{id}/emailChange")]
        public async Task EmailChange(string id, [FromQuery] string token, [FromQuery] string newEmail)
        {
            if (string.IsNullOrEmpty(token))
            {
                throw new TokenNotFoundException();
            }

            await _userRepository.ChangeEmail(id, token, newEmail);
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
            var result = await _userRepository.Remove(id);

            if (!result.Succeeded)
            {
                throw new UserNotDeletedException(result.Errors.Select(x => x.Description));
            }
        }

        /// <summary>
        ///     Email verification link
        /// </summary>
        /// <param name="id">User id</param>
        /// <param name="token">Token</param>
        /// <returns></returns>
        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> EmailConfirm(string id, [FromQuery] string token)
        {
            var result = await _userRepository.Confirm(id, token);

            if (!result.Succeeded)
            {
                throw new ConfirmEmailFailedException(result.Errors.Select(x => x.Description));
            }

            return Redirect(new UriBuilder()
            {
                Scheme = Request.Scheme,
                Host = Request.Host.Host,
                Port = 44489,
                Path = "EmailConfirmed",
            }.ToString());
        }

        private async Task<UserDto> HideData(UserDto userData, User user)
        {
            var logged = await _userRepository.GetByNick(User?.Identity?.Name ?? string.Empty);
            if (!(user?.UserName == logged?.UserName || await _userRepository.CheckRole(logged?.Id ?? string.Empty, Domain.Enums.Roles.Admin)))
            {
                if (user != null && user.HideInfo != null)
                {
                    if (user.HideInfo.Email)
                    {
                        userData.Email = string.Empty;
                    }

                    if (user.HideInfo.FirstName)
                    {
                        userData.FirstName = string.Empty;
                    }

                    if (user.HideInfo.LastName)
                    {
                        userData.LastName = string.Empty;
                    }

                    if (user.HideInfo.Age)
                    {
                        userData.Age = 0;
                    }
                }
            }
            return userData;
        }
    }
}