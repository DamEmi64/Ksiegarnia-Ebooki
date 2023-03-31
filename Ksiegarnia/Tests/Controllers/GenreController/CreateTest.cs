using Application.Controllers;
using Domain.DTOs;
using Domain.Repositories;
using Moq;

namespace Tests.Controllers.GenreController
{
    public class CreateTest
    {

        [Fact]
        public async Task Success()
        {
            var repo = new Mock<IGenreRepository>();

            var controller = new GenresController(repo.Object);

            var dto = new GenreDto()
            {
                Description = "TEST",
                Id = Guid.NewGuid(),
                Name = "TEST"
            };

            var result = await controller.Create(dto);

            Assert.Equal(result,System.Net.HttpStatusCode.Created);
        }
    }
}
