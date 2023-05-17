using Application.Controllers;
using Domain.DTOs;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Microsoft.Extensions.Hosting;
using Moq;

namespace Tests.Controllers.EbookController
{
    public class EditTest
    {
        private const string AuthorId = "TEST";

        private Guid _bookId = Guid.NewGuid();

        private readonly IGenreRepository _genreRepository;

        private readonly IHostEnvironment _hostEnviroment;

        public EditTest()
        {
            var genreRepo = new Mock<IGenreRepository>();
            _genreRepository = genreRepo.Object;
            var host = new Mock<IHostEnvironment>();
            _hostEnviroment = host.Object;
        }

        [Fact]
        public async Task CreateFailed_UserNotFound_Empty()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(AuthorId)).ReturnsAsync(new User());
            var bookRepo = new Mock<IEBookRepository>();

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository, _hostEnviroment);

            var obj = new CreateBookDto
            {
                Author = new UserDto() { Id = "RANDOM" },
                Content = Convert.ToBase64String(new byte[1024])
            };

             Assert.ThrowsAsync<UserNotFoundException>(async () => controller.Edit(obj, Guid.Empty));
        }

        [Fact]
        public async Task CreateFailed_UserNotFound_Wrong_ID()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(AuthorId)).ReturnsAsync(new User());
            var bookRepo = new Mock<IEBookRepository>();

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository, _hostEnviroment);

            var obj = new CreateBookDto
            {
                Author = new UserDto() { Id = "RANDOM" },
                Content = Convert.ToBase64String(new byte[1024])
            };

             Assert.ThrowsAsync<UserNotFoundException>(async () => controller.Edit(obj, Guid.NewGuid()));
        }

        [Fact]
        public async Task Success()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(AuthorId)).ReturnsAsync(new User());
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.Get(_bookId)).ReturnsAsync(new EBook());

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository, _hostEnviroment);

            var obj = new CreateBookDto
            {
                Author = new UserDto() { Id = AuthorId },
                Content = Convert.ToBase64String(new byte[1024]),
                Genre = new GenreDto()
                {
                    Description = string.Empty,
                    Id = Guid.NewGuid(),
                    Name = "TEST"
                }
            };

            var result = await controller.Edit(obj, _bookId);
            Assert.Equal(result, System.Net.HttpStatusCode.OK);
        }
    }
}
