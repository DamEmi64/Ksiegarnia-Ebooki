using Application.Controllers;
using Domain.Entitites;
using Domain.Repositories;
using Moq;

namespace Tests.Controllers.EbookController
{
    public class IndexTest
    {
        private readonly IGenreRepository _genreRepository;

        public IndexTest()
        {
            _genreRepository = new Mock<IGenreRepository>().Object;
        }

        [Fact]
        public async Task Success()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.GetEBooks()).ReturnsAsync(new List<EBook>() { new EBook(), new EBook()});

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            var result = await controller.Index();
            Assert.NotNull(result);
        }
    }
}
