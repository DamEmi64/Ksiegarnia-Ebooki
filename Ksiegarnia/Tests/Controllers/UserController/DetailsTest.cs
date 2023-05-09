using Application.Controllers;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;
using Microsoft.Extensions.Hosting;
using Moq;

namespace Tests.Controllers.UserController
{
    public class DetailsTest
    {
        private string userId = "TEST";
        private IHostEnvironment env = new Mock<IHostEnvironment>().Object;

        [Fact]
        public async Task Failed_UserNotFound_empty()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            var authService = new Mock<ISmtpService>();
            var ebookRepo = new Mock<IEBookRepository>();

            var controller = new UsersController(userRepo.Object, authService.Object, env,ebookRepo.Object);
            await Assert.ThrowsAsync<UserNotFoundException>(async () => await controller.Details(string.Empty));
        }

        [Fact]
        public async Task Failed_UserNotFound_wrong_id()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            var authService = new Mock<ISmtpService>();
            var ebookRepo = new Mock<IEBookRepository>();

            var controller = new UsersController(userRepo.Object, authService.Object, env, ebookRepo.Object);

            Assert.ThrowsAsync<UserNotFoundException>(async () => await controller.Details("TEST2"));
        }

        [Fact]
        public async Task Success()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            var authService = new Mock<ISmtpService>();
            var ebookRepo = new Mock<IEBookRepository>();

            var controller = new UsersController(userRepo.Object, authService.Object, env, ebookRepo.Object);

            var result = await controller.Details(userId);
            Assert.NotNull(result);
        }
    }

}

