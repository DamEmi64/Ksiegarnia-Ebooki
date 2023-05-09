using Application.Controllers;
using Domain.DTOs;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;
using Microsoft.Extensions.Hosting;
using Moq;

namespace Tests.Controllers.UserController
{
    public class SendTokenTest
    {
        private IHostEnvironment env = new Mock<IHostEnvironment>().Object;

        [Fact]
        public async Task Failed_FailedRegister()
        {
            var userRepo = new Mock<IUserRepository>();
            var authService = new Mock<ISmtpService>();
            var ebookRepo = new Mock<IEBookRepository>();

            var controller = new UsersController(userRepo.Object, authService.Object, env, ebookRepo.Object);
            await Assert.ThrowsAsync<UserNotFoundException>(async () => await controller.SendToken("TEST"));
        }
    }
}
