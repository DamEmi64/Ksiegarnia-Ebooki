using Application.Controllers;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Microsoft.Extensions.Hosting;
using Moq;

namespace Tests.Controllers.EbookController
{
    public class DetailsTest
    {
        private Guid BookId = Guid.NewGuid();

        private readonly IGenreRepository _genreRepository;

        private readonly IHostEnvironment _hostEnviroment;

        public DetailsTest()
        {
            var genreRepo = new Mock<IGenreRepository>();
            _genreRepository = genreRepo.Object;
            var host = new Mock<IHostEnvironment>();
            _hostEnviroment = host.Object;
        }


        [Fact]
        public async Task Failed_BookNotFoundException_Empty()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.Get(BookId)).ReturnsAsync(new EBook() { Verification = Domain.Enums.VerificationType.Accepted });

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository, _hostEnviroment);


            Assert.ThrowsAsync<BookNotFoundException>(async () => await controller.Details(Guid.Empty));
        }

        [Fact]
        public async Task Failed_BookNotFoundException_WrongId()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.Get(BookId)).ReturnsAsync(new EBook() { Verification = Domain.Enums.VerificationType.Accepted });

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository, _hostEnviroment);

            Assert.ThrowsAsync<BookNotFoundException>(async () => await controller.Details(Guid.NewGuid()));
        }

        [Fact]
        public async Task Failed_NotVerifiedException()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.Get(BookId)).ReturnsAsync(new EBook() { Verification = Domain.Enums.VerificationType.Rejected });

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository, _hostEnviroment);

            Assert.ThrowsAsync<BookNotVerifiedException>(async () => await controller.Details(Guid.NewGuid()));
        }

        [Fact]
        public async Task Success()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.Get(BookId)).ReturnsAsync(new EBook() { Verification = Domain.Enums.VerificationType.Accepted, Genre = new Genre(), Author = new User() });

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository, _hostEnviroment);

            var result = await controller.Details(BookId);
            Assert.NotNull(result);
        }
    }
}
