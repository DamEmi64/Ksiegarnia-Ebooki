using Application.Controllers;
using Domain.DTOs;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;
using Moq;

namespace Tests.Controllers.UserController
{
    public class SendTokenTest
    {
        [Fact]
        public async Task Failed_FailedRegister()
        {
            var userRepo = new Mock<IUserRepository>();
            var authService = new Mock<ISmtpService>();

            var controller = new UsersController(userRepo.Object, authService.Object);
            await Assert.ThrowsAsync<UserNotFoundException>(async () => await controller.SendToken("TEST"));
        }
    }
}
