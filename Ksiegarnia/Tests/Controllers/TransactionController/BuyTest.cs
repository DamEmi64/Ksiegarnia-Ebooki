using Application.Controllers;
using Domain.DTOs;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Moq;

namespace Tests.Controllers.TransactionController
{
    public class BuyTest
    {
        private readonly Guid bookId = Guid.NewGuid();
        private readonly string userId = "TEST";

        [Fact]
        public async Task Failed_BookNotFoundException_empty()
        {
            var bookReaderRepository = new Mock<IEBookReaderRepository>().Object;
            var bookRepository = new Mock<IEBookRepository>();
            var userRepository = new Mock<IUserRepository>();
            userRepository.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            bookRepository.Setup(x => x.Get(bookId)).ReturnsAsync(new EBook()
            {
                Author = new User(),
                Genre = new Genre(),
                Content = new byte[1024],
                Verified = true
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { string.Empty },
                BuyerId = userId
            };


            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object);

            Assert.ThrowsAsync<BookNotFoundException>(async () => await controller.Buy(buyerDto, string.Empty));
        }

        [Fact]
        public async Task Failed_BookNotFoundException_wrong_id()
        {
            var bookReaderRepository = new Mock<IEBookReaderRepository>().Object;
            var bookRepository = new Mock<IEBookRepository>();
            var userRepository = new Mock<IUserRepository>();
            userRepository.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            bookRepository.Setup(x => x.Get(bookId)).ReturnsAsync(new EBook()
            {
                Author = new User(),
                Genre = new Genre(),
                Content = new byte[1024],
                Verified = true
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { Guid.NewGuid().ToString() },
                BuyerId = userId
            };

            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object);

            Assert.ThrowsAsync<BookNotFoundException>(async () => await controller.Details(Guid.NewGuid()));
        }

        [Fact]
        public async Task Failed_UserNotFoundException_empty()
        {
            var bookReaderRepository = new Mock<IEBookReaderRepository>().Object;
            var bookRepository = new Mock<IEBookRepository>();
            var userRepository = new Mock<IUserRepository>();
            userRepository.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            bookRepository.Setup(x => x.Get(bookId)).ReturnsAsync(new EBook()
            {
                Author = new User(),
                Genre = new Genre(),
                Content = new byte[1024],
                Verified = true
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { string.Empty },
                BuyerId = string.Empty
            };


            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object);

            Assert.ThrowsAsync<UserNotFoundException>(async () => await controller.Buy(buyerDto, string.Empty));
        }

        [Fact]
        public async Task Failed_UserNotFoundException_wrong_id()
        {
            var bookReaderRepository = new Mock<IEBookReaderRepository>().Object;
            var bookRepository = new Mock<IEBookRepository>();
            var userRepository = new Mock<IUserRepository>();
            userRepository.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            bookRepository.Setup(x => x.Get(bookId)).ReturnsAsync(new EBook()
            {
                Author = new User(),
                Genre = new Genre(),
                Content = new byte[1024],
                Verified = true
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { Guid.NewGuid().ToString() },
                BuyerId = Guid.NewGuid().ToString()
            };

            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object);

            Assert.ThrowsAsync<UserNotFoundException>(async () => await controller.Details(Guid.NewGuid()));
        }

        [Fact]
        public async Task Failed_BookNotVerifiedException()
        {
            var bookReaderRepository = new Mock<IEBookReaderRepository>().Object;
            var bookRepository = new Mock<IEBookRepository>();
            var userRepository = new Mock<IUserRepository>();
            userRepository.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            bookRepository.Setup(x => x.Get(bookId)).ReturnsAsync(new EBook()
            {
                Author = new User(),
                Genre = new Genre(),
                Content = new byte[1024],
                Verified = false
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { Guid.NewGuid().ToString() },
                BuyerId = userId
            };

            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object);

            Assert.ThrowsAsync<BookNotVerifiedException>(async () => await controller.Details(Guid.NewGuid()));
        }

        [Fact]
        public async Task Success_empty_currency()
        {
            var bookReaderRepository = new Mock<IEBookReaderRepository>().Object;
            var bookRepository = new Mock<IEBookRepository>();
            var userRepository = new Mock<IUserRepository>();

            userRepository.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            bookRepository.Setup(x => x.Get(bookId)).ReturnsAsync(new EBook()
            {
                Author = new User(),
                Genre = new Genre(),
                Content = new byte[1024],
                Verified = true
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { bookId.ToString() },
                BuyerId = userId
            };

            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object);

            var result = await controller.Buy(buyerDto, string.Empty);
            Assert.NotNull(result);
        }

        [Fact]
        public async Task Success_euro_currency()
        {
            var bookReaderRepository = new Mock<IEBookReaderRepository>().Object;
            var bookRepository = new Mock<IEBookRepository>();
            var userRepository = new Mock<IUserRepository>();

            userRepository.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            bookRepository.Setup(x => x.Get(bookId)).ReturnsAsync(new EBook()
            {
                Author = new User(),
                Genre = new Genre(),
                Content = new byte[1024],
                Verified = true
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { bookId.ToString() },
                BuyerId = userId
            };

            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object);

            var result = await controller.Buy(buyerDto, "EUR");
            Assert.Equal(result,System.Net.HttpStatusCode.OK);
        }
    }
}
