using Domain.Context;
using Domain.DTOs;
using Domain.Entitites;
using Domain.Enums;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Repositories
{
    /// <summary>
    ///     User repo
    /// </summary>
    public class UserRepository : IUserRepository
    {
        private readonly KsiegarniaContext _context;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IUserStore<User> _userStore;
        private readonly IUserEmailStore<User> _emailStore;
        private readonly IRoleStore<Role> _roleStore;
        private readonly ISmtpService _authService;

        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="ksiegarniaContext"></param>
        /// <param name="signInManager"></param>
        /// <param name="userManager"></param>
        /// <param name="userStore"></param>
        /// <param name="authService"></param>
        /// <param name="roleStore"></param>
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

        /// <summary>
        ///     Generate token for password reset
        /// </summary>
        /// <param name="name">User email</param>
        /// <returns></returns>
        public async Task<SendTokenDto> GeneratePasswordToken(string name)
        {
            var user = await _userStore.FindByNameAsync(name, CancellationToken.None);
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            return new()
            {
                Email = user.Email,
                Id = user.Id,
                Token = token
            };
        }

        /// <summary>
        ///     Generate token for change email
        /// </summary>
        /// <param name="id"></param>
        /// <param name="newEmail"></param>
        /// <returns></returns>
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

        /// <summary>
        ///     Change email
        /// </summary>
        /// <param name="id">User Id</param>
        /// <param name="token">Token</param>
        /// <param name="newEmail">New email</param>
        /// <returns></returns>
        public async Task<bool> ChangeEmail(string id, string token, string newEmail)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);
            var result = await _userManager.ChangeEmailAsync(user, newEmail, token);
            _ = await _userManager.SetUserNameAsync(user, newEmail);
            _ = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                throw new ChangeEmailFailedException(result.Errors.Select(x => x.Description));
            }

            return result.Succeeded;
        }

        /// <summary>
        ///     Reset Password
        /// </summary>
        /// <param name="email">email</param>
        /// <param name="token">Token</param>
        /// <param name="newPassword">New password</param>
        /// <returns></returns>
        public async Task ResetPassword(string email, string token, string newPassword)
        {
            var user = await _userStore.FindByNameAsync(email, CancellationToken.None);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
            _ = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                throw new ChangeEmailFailedException(result.Errors.Select(x => x.Description));
            }
        }

        /// <summary>
        ///     Change Password
        /// </summary>
        /// <param name="id">Id</param>
        /// <param name="oldPassword">Old password</param>
        /// <param name="newPassword">New password</param>
        /// <returns></returns>
        /// <exception cref="ChangePasswordFailedException"></exception>
        public async Task ChangePassword(string id, string oldPassword, string newPassword)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);
            var changePasswordResult = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);
            if (!changePasswordResult.Succeeded)
            {
                throw new ChangePasswordFailedException(changePasswordResult.Errors.Select(x => x.Description));
            }
            await _userManager.UpdateAsync(user);
        }

        /// <summary>
        ///     Get User
        /// </summary>
        /// <param name="id">Id</param>
        /// <returns></returns>
        public async Task<User> Get(string id)
        {
            return await _userStore.FindByIdAsync(id, CancellationToken.None);
        }

        /// <summary>
        ///     Remove User
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task Remove(string id)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);
            await _userManager.DeleteAsync(user);
        }

        /// <summary>
        ///     Login user
        /// </summary>
        /// <param name="email"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
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

        /// <summary>
        ///     Log out
        /// </summary>
        /// <returns></returns>
        public async Task Logout()
        {
            await _signInManager.SignOutAsync();
        }

        /// <summary>
        ///     Register
        /// </summary>
        /// <param name="userData">user data</param>
        /// <param name="password">password</param>
        /// <returns></returns>
        /// <exception cref="ExceptionBase"></exception>
        public async Task<SendTokenDto> Register(RegisterDto userData, string password)
        {
            var user = CreateUser();
            user.FirstName = userData.FirstName;
            user.LastName = userData.LastName;
            user.PhoneNumber = userData.PhoneNumber;
            user.Nick = userData.Nick ?? string.Empty;
            user.BirthDate = userData.BirthDate;
            user.Distinctions = ConfigurationConst.FreeTimeDistinct;
            await _userStore.SetUserNameAsync(user, userData.Email, CancellationToken.None);
            await _emailStore.SetEmailAsync(user, userData.Email, CancellationToken.None);
            try
            {
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
                    throw new ExceptionBase(HttpStatusCode.BadRequest, "Register Failed", errorstr);
                }
            }
            catch (Exception e)
            {
                throw new ExceptionBase(HttpStatusCode.BadRequest, "Register Failed", e.Message);
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


        /// <summary>
        ///     Confirm email
        /// </summary>
        /// <param name="id"></param>
        /// <param name="token"></param>
        /// <returns></returns>
        public async Task Confirm(string id, string token)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);

            if (user != null)
            {
                await _userManager.ConfirmEmailAsync(user, token);
            }
        }

        /// <summary>
        ///     Add role to user
        /// </summary>
        /// <param name="id"></param>
        /// <param name="role"></param>
        /// <returns></returns>
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

        /// <summary>
        ///     Remove role from user
        /// </summary>
        /// <param name="id"></param>
        /// <param name="role"></param>
        /// <returns></returns>
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

        /// <summary>
        ///     Check role for user
        /// </summary>
        /// <param name="id"></param>
        /// <param name="role"></param>
        /// <returns></returns>
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

        /// <summary>
        ///     Get user by principal
        /// </summary>
        /// <param name="principal"></param>
        /// <returns></returns>
        public async Task<User> Get(ClaimsPrincipal principal)
        {
            return await _userManager.GetUserAsync(principal);
        }

        /// <summary>
        ///     Update user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
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

        /// <summary>
        ///     Get list of users
        /// </summary>
        /// <returns></returns>
        public async Task<List<User>> GetUsers()
        {
            return await _userManager.Users.ToListAsync();
        }

        /// <summary>
        ///     Get user by nick
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public async Task<User> GetByNick(string name)
        {
            return await _userStore.FindByNameAsync(name, CancellationToken.None);
        }

        /// <summary>
        ///     Get user roles
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<IEnumerable<string>> GetRoles(string id)
        {
            var user = await _userStore.FindByIdAsync(id, CancellationToken.None);

            if (user != null)
            {
                return await _userManager.GetRolesAsync(user);
            }

            return Enumerable.Empty<string>();
        }

        public async Task<bool> CheckPassword(string password, string id)
        {
            var user = await Get(id);

            if (user != null)
            {
                var result = _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, password);

                return result == PasswordVerificationResult.Success;
            }

            return false;
        }
    }
}

