using Application.Controllers;
using Domain.DTOs;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Tests.Controllers.TransactionController
{
#pragma warning disable CS1998 // Metoda asynchroniczna nie zawiera operatorów „await” i zostanie uruchomiona synchronicznie
    public class BuyTest
    {
        private readonly Guid bookId = Guid.NewGuid();
        private readonly string userId = "TEST";
        private Mock<IPaymentService> _paymentService => new();
        private Mock<ISmtpService> _smtpService => new();

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
                Verification = Domain.Enums.VerificationType.Accepted
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { string.Empty },
                BuyerId = userId
            };

            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object, _paymentService.Object, _smtpService.Object);

            Assert.ThrowsAsync<BookNotFoundException>(async () => await controller.Buy(buyerDto, Domain.Enums.TransactionType.Paypal, string.Empty));
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
                Verification = Domain.Enums.VerificationType.Accepted
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { Guid.NewGuid().ToString() },
                BuyerId = userId
            };

            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object, _paymentService.Object, _smtpService.Object);

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
                Verification = Domain.Enums.VerificationType.Accepted
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { string.Empty },
                BuyerId = string.Empty
            };


            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object, _paymentService.Object, _smtpService.Object);

            Assert.ThrowsAsync<UserNotFoundException>(async () => await controller.Buy(buyerDto, Domain.Enums.TransactionType.Paypal, string.Empty));
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
                Verification = Domain.Enums.VerificationType.Accepted
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { Guid.NewGuid().ToString() },
                BuyerId = Guid.NewGuid().ToString()
            };

            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object, _paymentService.Object, _smtpService.Object);

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
                Verification = Domain.Enums.VerificationType.Rejected
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { Guid.NewGuid().ToString() },
                BuyerId = userId
            };

            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object, _paymentService.Object, _smtpService.Object);

            Assert.ThrowsAsync<BookNotVerifiedException>(async () => await controller.Details(Guid.NewGuid()));
        }

        [Fact]
        public async Task Success_empty_currency()
        {
            var bookReaderRepository = new Mock<IEBookReaderRepository>().Object;
            var bookRepository = new Mock<IEBookRepository>();
            var userRepository = new Mock<IUserRepository>();
            var urlhelper = new Mock<IUrlHelper>();
            _paymentService.SetReturnsDefault("https://localhost:7270/swagger/index.html");
            userRepository.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            bookRepository.Setup(x => x.Get(bookId)).ReturnsAsync(new EBook()
            {
                Author = new User(),
                Genre = new Genre(),
                Content = new byte[1024],
                Verification = Domain.Enums.VerificationType.Accepted
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { bookId.ToString() },
                BuyerId = userId
            };

            //   _paymentService.Setup(x=>x.GetUri("","",transaction))

            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object, _paymentService.Object, _smtpService.Object);
              controller.Url = urlhelper.Object;
            var result = await controller.Buy(buyerDto, Domain.Enums.TransactionType.Token, string.Empty);
            Assert.NotNull(result);
        }

        [Fact]
        public async Task Success_euro_currency()
        {
            var bookReaderRepository = new Mock<IEBookReaderRepository>().Object;
            var bookRepository = new Mock<IEBookRepository>();
            var userRepository = new Mock<IUserRepository>();
            var urlhelper = new Mock<IUrlHelper>();
            _paymentService.SetReturnsDefault("https://localhost:7270/swagger/index.html");
            userRepository.Setup(x => x.Get(userId)).ReturnsAsync(new User());
            bookRepository.Setup(x => x.Get(bookId)).ReturnsAsync(new EBook()
            {
                Author = new User(),
                Genre = new Genre(),
                Content = new byte[1024],
                Verification = Domain.Enums.VerificationType.Accepted
            });

            var buyerDto = new BuyerDto()
            {
                BookIds = new List<string>() { bookId.ToString() },
                BuyerId = userId
            };

            var controller = new TransactionsController(bookReaderRepository, bookRepository.Object, userRepository.Object, _paymentService.Object, _smtpService.Object);
            controller.Url = urlhelper.Object;
            var result = await controller.Buy(buyerDto, Domain.Enums.TransactionType.Token, "EUR");
            Assert.NotNull(result);
        }
    }
#pragma warning restore CS1998 // Metoda asynchroniczna nie zawiera operatorów „await” i zostanie uruchomiona synchronicznie
}
