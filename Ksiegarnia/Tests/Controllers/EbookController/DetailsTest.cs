using Application.Controllers;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Moq;

namespace Tests.Controllers.EbookController
{
    public class DetailsTest
    {
        private Guid BookId = Guid.NewGuid();

        private readonly IGenreRepository _genreRepository;

        public DetailsTest()
        {
            _genreRepository = new Mock<IGenreRepository>().Object;
        }


        [Fact]
        public async Task Failed_BookNotFoundException_Empty()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.Get(BookId)).ReturnsAsync(new EBook() { Verified = true});

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            Assert.ThrowsAsync<BookNotFoundException>(async () => await controller.Details(Guid.Empty));
        }

        [Fact]
        public async Task Failed_BookNotFoundException_WrongId()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.Get(BookId)).ReturnsAsync(new EBook() { Verified = true });

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            Assert.ThrowsAsync<BookNotFoundException>(async () => await controller.Details(Guid.NewGuid()));
        }

        [Fact]
        public async Task Failed_NotVerifiedException()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.Get(BookId)).ReturnsAsync(new EBook() { Verified = false });

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            Assert.ThrowsAsync<BookNotVerifiedException>(async () => await controller.Details(Guid.NewGuid()));
        }

        [Fact]
        public async Task Success()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.Get(BookId)).ReturnsAsync(new EBook() { Verified = true , Genre = new Genre(), Author = new User() });

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            var result = await controller.Details(BookId);
            Assert.NotNull(result);
        }
    }
}
