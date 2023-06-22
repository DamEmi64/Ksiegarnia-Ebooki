using Domain.DTOs;
using Domain.Entitites;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Domain.Repositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetUsers();

        Task<bool> CheckPassword(string password, string id);


        Task<Premium?> GetPremium(string userId);

        Task<User> Get(ClaimsPrincipal claimsPrincipal);

        Task<User> Get(string id);

        Task<User> GetByNick(string name);
        Task<SendTokenDto> Register(RegisterDto userData, string password);
        Task<User> Login(string email, string password);

        Task Logout();

        Task ResetPassword(string id, string token, string newPassword);

        Task ChangePassword(string id, string oldPassword, string newPassword);

        Task<SendTokenDto> GeneratePasswordToken(string name);

        Task<IdentityResult?> Remove(string id);

        Task AddRole(string id, Roles role);

        Task<bool> CheckRole(string id, Roles role);

        Task<IEnumerable<string>> GetRoles(string id);

        Task RemoveRole(string id, Roles roles);

        Task<IdentityResult?> Confirm(string id, string token);

        Task<SendTokenDto> ChangeEmailToken(string id, string newEmail);

        Task<bool> ChangeEmail(string id, string token, string newEmail);

        Task Update(User user);
    }
}
