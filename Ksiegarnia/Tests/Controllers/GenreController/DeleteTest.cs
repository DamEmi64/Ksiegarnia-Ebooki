using Application.Controllers;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Moq;

namespace Tests.Controllers.GenreController
{
    public class DeleteTest
    {
        private readonly Guid _genreId = Guid.NewGuid();

        [Fact]
        public async Task Failed_GenreNotFoundException_empty()
        {
            var repo = new Mock<IGenreRepository>();
            repo.Setup(x => x.Get(_genreId)).ReturnsAsync(new Genre());

            var controller = new GenresController(repo.Object);

            Assert.ThrowsAsync<GenreNotFoundException>(async () => await controller.Delete(Guid.Empty));
        }

        [Fact]
        public async Task Failed_GenreNotFoundException_wrong_if()
        {
            var repo = new Mock<IGenreRepository>();
            repo.Setup(x => x.Get(_genreId)).ReturnsAsync(new Genre());

            var controller = new GenresController(repo.Object);

            Assert.ThrowsAsync<GenreNotFoundException>(async () => await controller.Delete(Guid.NewGuid()));
        }

        [Fact]
        public async Task Success()
        {
            var repo = new Mock<IGenreRepository>();
            repo.Setup(x=>x.Get(_genreId)).ReturnsAsync(new Genre());

            var controller = new GenresController(repo.Object);

           var result = await controller.Delete(_genreId);

            Assert.Equal(result, System.Net.HttpStatusCode.OK);
        }
    }
}
