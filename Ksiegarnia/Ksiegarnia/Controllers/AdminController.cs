using Domain.Entitites;
using Domain.Enums;
using Domain.Repositories;
using Infrastructure.Exceptions;
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

        /// <summary>
        ///     Constructor
        /// </summary>

        /// <param name="userRepository"></param>
        public AdminController(IUserRepository userRepository, INotifyRepository notifyRepository)
        {
            _userRepository = userRepository;
            _notifyRepository = notifyRepository;
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
                notification.StatusChangeDate = DateTime.UtcNow;

                await _notifyRepository.Add(notification);
                await _notifyRepository.SaveChanges();
                return HttpStatusCode.OK;
            }

            return HttpStatusCode.BadRequest;
        }

        /// <summary>
        ///     Get notification 
        /// </summary>
        /// <param name="id">Notification id</param>
        /// <returns></returns>
        [HttpGet("Notification/{id}")]
        public async Task<Notification> Notify(Guid id)
        {
            var notify =  await _notifyRepository.Get(id);

            if (notify == null)
            {
                throw new DefaultException(HttpStatusCode.NotFound, "Notification not found");
            }

            return notify;
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
                throw new DefaultException(HttpStatusCode.NotFound, "Notification not found");
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
                throw new DefaultException(HttpStatusCode.NotFound, "Notification not found");
            }

            notify.Status = status;
            notify.StatusChangeDate = DateTime.Now;

            await _notifyRepository.SaveChanges();

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     add role to user (ADMIN)
        /// </summary>
        /// <param name="id">user id</param>
        /// <param name="role">user snew role</param>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
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
    }
}
