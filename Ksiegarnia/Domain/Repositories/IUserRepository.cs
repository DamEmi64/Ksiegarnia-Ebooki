using Domain.DTOs;
using Domain.Entitites;
using Microsoft.AspNetCore.Identity;

namespace Domain.Repositories
{
    public interface IUserRepository
    {
        Task<User> Get(string id);
        Task<User> Register(RegisterDto userData, string password);
        Task<User> Login(string email, string password);

        Task ResetPassword(string id, string token, string newPassword);

        Task ChangePassword(string id, string oldPassword, string newPassword);

        Task<string> GeneratePasswordToken(string id);

        Task Remove(string id);
    }
}
