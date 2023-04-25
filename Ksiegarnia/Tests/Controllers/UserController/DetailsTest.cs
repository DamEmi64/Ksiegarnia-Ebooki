using Application.Controllers;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;
using Moq;

namespace Tests.Controllers.UserController
{
    public class DetailsTest
    {
        private string userId = "TEST";

        [Fact]
        public async Task Failed_UserNotFound_empty()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            var authService = new Mock<ISmtpService>();

            var controller = new UsersController(userRepo.Object, authService.Object);

            var result = await controller.Details(userId);
            await Assert.ThrowsAsync<UserNotFoundException>(async () => await controller.Details(string.Empty));
        }

        [Fact]
        public async Task Failed_UserNotFound_wrong_id()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            var authService = new Mock<ISmtpService>();

            var controller = new UsersController(userRepo.Object, authService.Object);

            var result = await controller.Details(userId);
            Assert.ThrowsAsync<UserNotFoundException>(async () => await controller.Details("TEST2"));
        }

        [Fact]
        public async Task Success()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            var authService = new Mock<ISmtpService>();

            var controller = new UsersController(userRepo.Object, authService.Object);

            var result = await controller.Details(userId);
            Assert.NotNull(result);
        }
    }

}

