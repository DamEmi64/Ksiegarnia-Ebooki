using Application.Controllers;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Moq;

namespace Tests.Controllers.EbookController
{
    public class DeleteTest
    {
        private Guid BookId = Guid.NewGuid();

        private readonly IGenreRepository _genreRepository;

        public DeleteTest()
        {
            _genreRepository = new Mock<IGenreRepository>().Object;
        }


        [Fact]
        public async Task Failed_BookNotFoundException_Empty()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.Get(BookId)).ReturnsAsync(new EBook() { });

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            Assert.ThrowsAsync<BookNotFoundException>(async () => await controller.Delete(String.Empty));
        }

        [Fact]
        public async Task Failed_BookNotFoundException_WrongFormat()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.Get(BookId)).ReturnsAsync(new EBook() { });

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            Assert.ThrowsAsync<BookNotFoundException>(async () => await controller.Delete("TEST"));
        }

        [Fact]
        public async Task Failed_BookNotFoundException_WrongId()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.Get(BookId)).ReturnsAsync(new EBook() { });

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            Assert.ThrowsAsync<BookNotFoundException>(async () => await controller.Delete(Guid.NewGuid().ToString()));
        }

        [Fact]
        public async Task Success()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.Get(BookId)).ReturnsAsync(new EBook() { });

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            var result = await controller.Delete(BookId.ToString());
            Assert.Equal(result, System.Net.HttpStatusCode.OK);
        }
    }
}
