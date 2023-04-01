using Application.Controllers;
using Domain.DTOs;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;
using Moq;

namespace Tests.Controllers.UserController
{
    public class RegisterTest
    {
        [Fact]
        public async Task Failed_FailedRegister()
        {
            var data = new RegisterDto()
            {
                Email = "email@test.com",
                FirstName = "Test",
                LastName = "test",
                Nick = "Test",
                Password = "Test"
            };

            var userRepo = new Mock<IUserRepository>();
            var authService = new Mock<IAuthService>();

            var controller = new UsersController(userRepo.Object, authService.Object);
            await Assert.ThrowsAsync<RegisterFailedException>(async () => await controller.Register(data));
        }
    }
}
