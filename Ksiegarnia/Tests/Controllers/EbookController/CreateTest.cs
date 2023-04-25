using Application.Controllers;
using Domain.DTOs;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Moq;

namespace Tests.Controllers.EbookController
{
    public class CreateTest
    {
        private const string AuthorId = "TEST";

        private Guid _genreId = Guid.NewGuid();

        private byte[] bookData = new byte[1024];

        private readonly IGenreRepository _genreRepository;

        public CreateTest()
        {
            var genreRepo = new Mock<IGenreRepository>();
            genreRepo.Setup(x => x.Get(_genreId)).ReturnsAsync(new Genre());
            _genreRepository = genreRepo.Object;
        }

        [Fact]
        public async Task CreateFailed_BookHasContent()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(AuthorId)).ReturnsAsync(new User());
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.CheckIfExist(bookData)).ReturnsAsync(true);

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            var obj = new CreateBookDto
            {
                Author = new UserDto() { Id = AuthorId },
                Content = Convert.ToBase64String(bookData)
            };

            Assert.ThrowsAsync<BookHasThisContentException>(async () => controller.Create(obj));
        }

        [Fact]
        public async Task CreateFailed_UserNotFound_Wrong_ID()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(AuthorId)).ReturnsAsync(new User());
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.CheckIfExist(bookData)).ReturnsAsync(false);

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            var obj = new CreateBookDto
            {
                Author = new UserDto() { Id = "RANDOM" },
                Content = Convert.ToBase64String(bookData)
            };

            Assert.ThrowsAsync<UserNotFoundException>(async () => controller.Create(obj));
        }

        [Fact]
        public async Task CreateFailed_UserNotFound_not_id()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(AuthorId)).ReturnsAsync(new User());
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.CheckIfExist(bookData)).ReturnsAsync(false);

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            var obj = new CreateBookDto
            {
                Author = new UserDto() { Id = string.Empty },
                Content = Convert.ToBase64String(bookData)
            };

            Assert.ThrowsAsync<UserNotFoundException>(async () => controller.Create(obj));
        }

        [Fact]
        public async Task Failed_GenreNotFoundException_empty()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(AuthorId)).ReturnsAsync(new User());
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.CheckIfExist(bookData)).ReturnsAsync(false);

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            var obj = new CreateBookDto
            {
                Author = new UserDto() { Id = string.Empty },
                Content = Convert.ToBase64String(bookData),
                Genre = new GenreDto() { Id = Guid.Empty }
            };

            Assert.ThrowsAsync<GenreNotFoundException>(async () => controller.Create(obj));
        }

        [Fact]
        public async Task Failed_GenreNotFoundException_wrong_id()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(AuthorId)).ReturnsAsync(new User());
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.CheckIfExist(bookData)).ReturnsAsync(false);

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            var obj = new CreateBookDto
            {
                Author = new UserDto() { Id = string.Empty },
                Content = Convert.ToBase64String(bookData),
                Genre = new GenreDto() { Id = Guid.NewGuid() }
            };

            Assert.ThrowsAsync<GenreNotFoundException>(async () => controller.Create(obj));
        }

        [Fact]
        public async Task Success()
        {
            var userRepo = new Mock<IUserRepository>();
            userRepo.Setup(x => x.Get(AuthorId)).ReturnsAsync(new User());
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.CheckIfExist(bookData)).ReturnsAsync(false);

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            var obj = new CreateBookDto
            {
                Author = new UserDto() { Id = AuthorId },
                Content = Convert.ToBase64String(bookData),
                Genre = new GenreDto()
                {
                    Description = string.Empty,
                    Id = _genreId,
                    Name = "TEST"
                }
            };

            var result = await controller.Create(obj);
            Assert.Equal(result, System.Net.HttpStatusCode.Created);
        }
    }
}
