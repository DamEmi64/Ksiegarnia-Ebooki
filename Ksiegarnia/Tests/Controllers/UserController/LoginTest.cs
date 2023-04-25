using Application.Controllers;
using Domain.DTOs;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;
using Microsoft.Extensions.Hosting;
using Moq;

namespace Tests.Controllers.UserController
{
    public class LoginTest
    {
        private IHostEnvironment env = new Mock<IHostEnvironment>().Object;

        [Fact]
        public async Task Failed_LoginFailed()
        {
            var userRepo = new Mock<IUserRepository>();
            var authService = new Mock<ISmtpService>();

            var controller = new UsersController(userRepo.Object, authService.Object, env);

            var data = new LoginDto()
            {
                Email = "email@test.com",
                Password = "Test"
            };

            await Assert.ThrowsAsync<LoginFailedException>(async () => await controller.Login(data));
        }

        [Fact]
        public async Task Success()
        {
            var data = new LoginDto()
            {
                Email = "email@test.com",
                Password = "Test"
            };

            var userRepo = new Mock<IUserRepository>();
            var authService = new Mock<ISmtpService>();
            userRepo.Setup(x => x.Login(data.Email, data.Password)).ReturnsAsync(new User());

            var controller = new UsersController(userRepo.Object, authService.Object, env);
            var result = await controller.Login(data);
            Assert.NotNull(result);
        }
    }
}
