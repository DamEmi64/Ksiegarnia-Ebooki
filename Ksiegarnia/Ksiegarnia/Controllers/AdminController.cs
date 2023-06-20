using Domain.DTOs;
using Domain.Entitites;
using Domain.Enums;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Application.Controllers
{
    /// <summary>
    ///     Admin controller
    /// </summary>
    [Route("Admin")]
    [ApiController]
    public class AdminController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly INotifyRepository _notifyRepository;
        private readonly IEBookRepository _eBookRepository;
        private readonly ISmtpService _smtpService;
        private readonly IEBookRepository _bookRepository;

        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="userRepository"></param>
        /// <param name="notifyRepository"></param>
        /// <param name="eBookRepository"></param>
        /// <param name="smtpService"></param>
        public AdminController(IUserRepository userRepository, INotifyRepository notifyRepository, IEBookRepository eBookRepository, ISmtpService smtpService, IEBookRepository bookRepository)
        {
            _userRepository = userRepository;
            _notifyRepository = notifyRepository;
            _eBookRepository = eBookRepository;
            _smtpService = smtpService;
            _bookRepository = bookRepository;
        }

        /// <summary>
        ///     Notify 
        /// </summary>
        /// <param name="notification">notification</param>
        /// <returns></returns>
        [HttpPost("Notify")]
        public async Task<HttpStatusCode> Notify([FromBody] Notification notification)
        {
            if (ModelState.IsValid)
            {
                notification.CreationDate = DateTime.UtcNow;
                notification.User = await _userRepository.GetByNick(User.Identity?.Name ?? String.Empty);
                notification.StatusChangeDate = DateTime.UtcNow;

                await _notifyRepository.Add(notification);
                await _notifyRepository.SaveChanges();
                await SendNotifyToEmail(notification);
                
                return HttpStatusCode.OK;
            }

            return HttpStatusCode.BadRequest;
        }

        /// <summary>
        ///     Get Notifications 
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpGet("Notification")]
        public async Task<List<Notification>> GetNotifications()
        {
            return await _notifyRepository.GetAll();
        }

        /// <summary>
        ///     Get notification 
        /// </summary>
        /// <param name="id">Notification id</param>
        /// <returns></returns>
        [HttpGet("Notification/{id}")]
        public async Task<Notification> GetNotify(Guid id)
        {
            var notify =  await _notifyRepository.Get(id);

            if (notify == null)
            {
                throw new ExceptionBase(HttpStatusCode.NotFound, "Notification not found");
            }

            return notify;
        }

        /// <summary>
        ///     Get Ebook content by id
        /// </summary>
        /// <param name="id">Ebook Id</param>
        /// <returns>Ebook content</returns>
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        /// <exception cref="BookNotVerifiedException">When book is not verified...</exception>
        [Authorize(Roles = "Admin")]
        [HttpGet("books/{id}/read")]
        public async Task<byte[]> Read(Guid? id)
        {
            var ebook = await _bookRepository.Get(id ?? Guid.Empty);
            if (ebook == null)
            {
                throw new BookNotFoundException(id.ToString() ?? string.Empty);
            }

            return ebook.Content;
        }

        /// <summary>
        ///     Delete notification (ADMIN)
        /// </summary>
        /// <param name="id">Notification id</param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpDelete("Notification/{id}")]
        public async Task<HttpStatusCode> Remove(Guid id)
        {
            var notify = await _notifyRepository.Get(id);

            if (notify == null)
            {
                throw new ExceptionBase(HttpStatusCode.NotFound, "Notification not found");
            }

            await _notifyRepository.Remove(notify.Id);
            await _notifyRepository.SaveChanges();

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Change notification status  (ADMIN)
        /// </summary>
        /// <param name="id">Notification id</param>
        /// <param name="status">Notification status</param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpPost("Notification/{id}/{status}")]
        public async Task<HttpStatusCode> ChangeStatus(Guid id, NotificationStatus status)
        {
            var notify = await _notifyRepository.Get(id);

            if (notify == null)
            {
                throw new ExceptionBase(HttpStatusCode.NotFound, "Notification not found");
            }

            notify.Status = status;
            notify.StatusChangeDate = DateTime.Now;

            await _notifyRepository.SaveChanges();

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Verify book
        /// </summary>
        /// <param name="id">Book id</param>
        /// <param name="verifyName">Verification Data (name)</param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpGet("Ebook/{id}/verify")]
        public async Task<HttpStatusCode> Verify(Guid id, [FromQuery] string verifyName)
        {
            await _eBookRepository.Verify(id, verifyName);
            await _eBookRepository.SaveChanges();
            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Block Book  (ADMIN)
        /// </summary>
        /// <param name="id">Book id</param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpPost("Ebook/{id}/block")]
        public async Task<HttpStatusCode> BlockBook(Guid id)
        {
            var book = await _eBookRepository.Get(id);

            if (book == null)
            {
                throw new BookNotFoundException(id.ToString());
            }

            book.Verification = VerificationType.Rejected;

            await _eBookRepository.SaveChanges();

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Get all Users (ADMIN)
        /// </summary>
        /// <param name="id">user id</param>
        /// <param name="role">user snew role</param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        [HttpGet("User")]
        public async Task<List<UserDto>> GetUsers()
        {
            var users = await _userRepository.GetUsers();

            if (users != null)
            {
                return users.ToDTOs().ToList();
            }

            return new List<UserDto>() { };
        }

        /// <summary>
        ///     add role to user (ADMIN)
        /// </summary>
        /// <param name="id">user id</param>
        /// <param name="role">user snew role</param>
        /// <returns></returns>
        [HttpPut("User/{id}/{role}")]
        public async Task<HttpStatusCode> AddRole(string id, Roles role)
        {
            var user = await _userRepository.Get(id);

            if (user == null)
            {
                throw new UserNotFoundException(id);
            }

            await _userRepository.AddRole(user.Id, role);
            await _userRepository.Update(user);

            return HttpStatusCode.OK;
        }


        /// <summary>
        ///     remove role from user (ADMIN)
        /// </summary>
        /// <param name="id">user id</param>
        /// <param name="role">user snew role</param>
        /// <returns></returns>
        [HttpDelete("User/{id}/{role}")]
        public async Task<HttpStatusCode> RemoveRole(string id, Roles role)
        {
            var user = await _userRepository.Get(id);

            if (user == null)
            {
                throw new UserNotFoundException(id);
            }

            await _userRepository.RemoveRole(user.Id, role);
            await _userRepository.Update(user);

            return HttpStatusCode.OK;
        }

        private async Task SendNotifyToEmail(Notification notification)
        {
            var content = $"User {notification.User.Nick} send new notification  about object {notification.Id}: {notification.Description}";

            foreach (var user in await _userRepository.GetUsers())
            {
                if (await _userRepository.CheckRole(user.Id,Roles.Admin))
                {
                    _smtpService.SendEmail(content, user.Email, $"Notification {notification.Id}");
                }
            }

        }
    }
}
