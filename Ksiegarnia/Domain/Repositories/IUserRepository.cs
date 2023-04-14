using Domain.DTOs;
using Domain.Entitites;
using Domain.Enums;
using System.Security.Claims;

namespace Domain.Repositories
{
    public interface IUserRepository
    {

        Task<User> Get(ClaimsPrincipal claimsPrincipal);

        Task<User> Get(string id);
        Task<SendTokenDto> Register(RegisterDto userData, string password);
        Task<User> Login(string email, string password);

        Task ResetPassword(string id, string token, string newPassword);

        Task ChangePassword(string id, string oldPassword, string newPassword);

        Task<SendTokenDto> GeneratePasswordToken(string id);

        Task Remove(string id);

        Task AddRole(string id, Roles role);

        Task<bool> CheckRole(string id, Roles role);

        Task RemoveRole(string id, Roles roles);

        Task Confirm(string id, string token);


        Task<SendTokenDto> ChangeEmailToken(string id, string newEmail);

        Task<bool> ChangeEmail(string id, string token, string newEmail);

        Task Update(User user);
    }
}
