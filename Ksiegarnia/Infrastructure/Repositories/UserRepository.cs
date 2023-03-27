﻿using Domain.Context;
using Domain.DTOs;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using System.Text.Encodings.Web;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly KsiegarniaContext _context;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IUserStore<User> _userStore;
        private readonly IUserEmailStore<User> _emailStore;
        private readonly IAuthService _authService;
        private readonly IHttpContextAccessor httpContextAccessor;

        public UserRepository(KsiegarniaContext ksiegarniaContext, SignInManager<User> signInManager, UserManager<User> userManager, IUserStore<User> userStore, IAuthService authService)
        {
            _context = ksiegarniaContext;
            _signInManager = signInManager;
            _userManager = userManager;
            _userStore = userStore;
            _emailStore = (IUserEmailStore<User>)userStore;
            _authService = authService;
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

            var result = await _signInManager.PasswordSignInAsync(user, password, true, lockoutOnFailure: true);
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

        public async Task<SendTokenDto> Register(RegisterDto userData, string password)
        {
            var user = CreateUser();
            user.FirstName = userData.FirstName;
            user.LastName = userData.LastName;
            user.PhoneNumber = userData.PhoneNumber;
            user.Nick = userData.Nick;
            await _userStore.SetUserNameAsync(user, user.UserName, CancellationToken.None);
            await _emailStore.SetEmailAsync(user, user.Email, CancellationToken.None);
            var result = await _userManager.CreateAsync(user, password);

            if (result.Succeeded)
            {
                var userId = await _userManager.GetUserIdAsync(user);
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                await _userManager.ConfirmEmailAsync(user, code);
                return new()
                {
                    Email = user.Email,
                    Id = user.Id,
                    Token = code
                };
            }

            throw new Exception("Register Failed");
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
    }
}

