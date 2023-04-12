﻿using Application.Controllers;
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
            bookRepo.Setup(x => x.GetEBooks(null,null,"")).ReturnsAsync(new List<EBook>()
            { new EBook() { Genre = new Genre() , Author = new User() },
                new EBook() { Genre = new Genre(), Author = new User() } });

            var controller = new EBooksController(bookRepo.Object, userRepo.Object, _genreRepository);

            var result = await controller.Index();
            Assert.NotNull(result);
        }
    }
}
