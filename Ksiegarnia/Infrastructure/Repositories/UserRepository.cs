using Domain.Context;
using Domain.DTOs;
using Domain.Entitites;
using Domain.Enums;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Claims;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly KsiegarniaContext _context;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IUserStore<User> _userStore;
        private readonly IUserEmailStore<User> _emailStore;
        private readonly IRoleStore<Role> _roleStore;
        private readonly ISmtpService _authService;
        private readonly IHttpContextAccessor httpContextAccessor;

        public UserRepository(KsiegarniaContext ksiegarniaContext,
            SignInManager<User> signInManager,
            UserManager<User> userManager,
            IUserStore<User> userStore,
            ISmtpService authService,
            IRoleStore<Role> roleStore)
        {
            _context = ksiegarniaContext;
            _signInManager = signInManager;
            _userManager = userManager;
            _userStore = userStore;
            _emailStore = (IUserEmailStore<User>)userStore;
            _authService = authService;
            _roleStore = roleStore;
        }

        public async Task<SendTokenDto> GeneratePasswordToken(string id)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            return new()
            {
                Email = user.Email,
                Id = user.Id,
                Token = token
            };
        }

        public async Task<SendTokenDto> ChangeEmailToken(string id, string newEmail)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);
            var token = await _userManager.GenerateChangeEmailTokenAsync(user, newEmail);
            return new()
            {
                Email = newEmail,
                Id = user.Id,
                Token = token
            };
        }

        public async Task<bool> ChangeEmail(string id, string token, string newEmail)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);
            var result = await _userManager.ChangeEmailAsync(user, newEmail, token);

            return result.Succeeded;
        }

        public async Task ResetPassword(string id, string token, string newPassword)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
        }

        public async Task ChangePassword(string id, string oldPassword, string newPassword)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);
            var changePasswordResult = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);
            if (!changePasswordResult.Succeeded)
            {
                throw new Exception("Password change failed");
            }
        }

        public async Task<User> Get(string id)
        {
            return await _userStore.FindByIdAsync(id, CancellationToken.None);
        }
        public async Task Remove(string id)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);
            await _userManager.DeleteAsync(user);
        }

        public async Task<User> Login(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            var result = await _signInManager.PasswordSignInAsync(user, password, true, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                return user;
            }

            if (result.IsLockedOut)
            {
                throw new Exception("User not blocked");
            }

            throw new Exception("Login Failed");
        }

        public async Task Logout()
        {
            await _signInManager.SignOutAsync();
        }

        public async Task<SendTokenDto> Register(RegisterDto userData, string password)
        {
            var user = CreateUser();
            user.FirstName = userData.FirstName;
            user.LastName = userData.LastName;
            user.PhoneNumber = userData.PhoneNumber;
            user.Nick = userData.Nick;
            await _userStore.SetUserNameAsync(user, userData.Email, CancellationToken.None);
            await _emailStore.SetEmailAsync(user, userData.Email, CancellationToken.None);
            var result = await _userManager.CreateAsync(user, password);

            if (result.Succeeded)
            {
                var userId = await _userManager.GetUserIdAsync(user);
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                await _userManager.ConfirmEmailAsync(user, code);
                await AddRole(user.Id, Roles.User);
                return new()
                {
                    Email = user.Email,
                    Id = user.Id,
                    Token = code
                };
            }
            else
            {
                var errorstr = "";
                foreach (var error in result.Errors)
                {
                    errorstr += error.Description;
                }
                throw new DefaultException(HttpStatusCode.BadRequest, "Register Failed", errorstr);
            }
        }

        private User CreateUser()
        {
            try
            {
                return Activator.CreateInstance<User>();
            }
            catch
            {
                throw new InvalidOperationException($"Can't create an instance of '{nameof(User)}'. " +
                    $"Ensure that '{nameof(User)}' is not an abstract class and has a parameterless constructor, or alternatively " +
                    $"override the register page in /Areas/Identity/Pages/Account/Register.cshtml");
            }
        }

        public async Task Confirm(string id, string token)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);

            if (user != null)
            {
                await _userManager.ConfirmEmailAsync(user, token);
            }
        }

        public async Task AddRole(string id, Roles role)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);

            await CreateRolesIfNotExists();

            if (user != null)
            {
                switch (role)
                {
                    case Roles.Admin: await _userManager.AddToRoleAsync(user, Enum.GetName(Roles.Admin)); break;
                    case Roles.PremiumUser: await _userManager.AddToRoleAsync(user, Enum.GetName(Roles.PremiumUser)); break;
                    default: await _userManager.AddToRoleAsync(user, Enum.GetName(Roles.User)); break;
                }

            }
        }

        public async Task RemoveRole(string id, Roles role)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);

            await CreateRolesIfNotExists();

            if (user != null)
            {
                switch (role)
                {
                    case Roles.Admin: await _userManager.RemoveFromRoleAsync(user, Enum.GetName(Roles.Admin)); break;
                    case Roles.PremiumUser: await _userManager.RemoveFromRoleAsync(user, Enum.GetName(Roles.PremiumUser)); break;
                    default: await _userManager.RemoveFromRoleAsync(user, Enum.GetName(Roles.User)); break;
                }

            }
        }

        public async Task<bool> CheckRole(string id, Roles role)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);

            await CreateRolesIfNotExists();

            if (user != null)
            {
                var roles = await _userManager.GetRolesAsync(user);

                return roles.Contains(Enum.GetName(role));
            }

            return false;
        }

        public async Task<User> Get(ClaimsPrincipal principal)
        {
            return await _userManager.GetUserAsync(principal);
        }

        public async Task Update(User user)
        {
            await _userManager.UpdateAsync(user);
        }

        private async Task CreateRolesIfNotExists()
        {
            Role roleDb;
            foreach (var role in Enum.GetNames(typeof(Roles)))
            {
                roleDb = await _roleStore.FindByNameAsync(role, CancellationToken.None);
                if (roleDb == null)
                {
                    roleDb = Activator.CreateInstance<Role>();

                    roleDb.Name = role;
                    roleDb.NormalizedName = roleDb.Name.Normalize();
                    await _roleStore.CreateAsync(roleDb, CancellationToken.None);
                }
            }
        }

        public async Task<List<User>> GetUsers()
        {
            return await _userManager.Users.ToListAsync();
        }

        public async Task<User> GetByNick(string name)
        {
            return await _userStore.FindByNameAsync(name, CancellationToken.None);
        }
    }
}

