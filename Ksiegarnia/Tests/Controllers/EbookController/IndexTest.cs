using Application.Controllers;
using Domain.Entitites;
using Domain.Repositories;
using Microsoft.Extensions.Hosting;
using Moq;

namespace Tests.Controllers.EbookController
{
    public class IndexTest
    {
        private readonly IGenreRepository _genreRepository;
        private readonly IHostEnvironment _hostEnviroment;

        public IndexTest()
        {
            var genreRepo = new Mock<IGenreRepository>();
            _genreRepository = genreRepo.Object;
            var host = new Mock<IHostEnvironment>();
            _hostEnviroment = host.Object;
        }

        [Fact]
        public async Task Success()
        {
            var userRepo = new Mock<IUserRepository>();
            var bookRepo = new Mock<IEBookRepository>();
            bookRepo.Setup(x => x.GetEBooks(null,null,"")).ReturnsAsync(new List<EBook>()
            { new EBook() { Genre = new Genre() , Author = new User() },
                new EBook() { Genre = new Genre(), Author = new User() } });

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository, _hostEnviroment);

            var result = await controller.Index();
            Assert.NotNull(result);
        }
    }
}
