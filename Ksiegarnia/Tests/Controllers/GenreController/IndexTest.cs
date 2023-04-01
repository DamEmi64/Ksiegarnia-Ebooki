using Application.Controllers;
using Domain.Repositories;
using Moq;

namespace Tests.Controllers.GenreController
{
    public class IndexTest
    {
        [Fact]
        public async Task Success()
        {
            var repo = new Mock<IGenreRepository>();

            var controller = new GenresController(repo.Object);

            var result = await controller.Index();

            Assert.NotNull(result);
        }
    }
}
