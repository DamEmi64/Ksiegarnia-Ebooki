using Application.Controllers;
using Domain.Entitites;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Moq;

namespace Tests.Controllers.TransactionController
{
    public class DetailsTest
    {
        private readonly Guid transactionId = Guid.NewGuid();

        [Fact]
        public async Task Failed_TransactionNotFoundException_empty()
        {
            var bookReaderRepository = new Mock<IEBookReaderRepository>();
            bookReaderRepository.Setup(x => x.GetTransaction(transactionId)).ReturnsAsync(new Transaction()
            {
                EBookReader = new EBookReader()
                {
                    EBook = new EBook()
                    {
                        Genre = new Genre(),
                        Author = new User()
                    },
                    User = new User(),
                }
            });
            var bookRepository = new Mock<IEBookRepository>().Object;
            var userRepository = new Mock<IUserRepository>().Object;

            var controller = new TransactionsController(bookReaderRepository.Object, bookRepository, userRepository);

            Assert.ThrowsAsync<TransactionNotFoundException>(async () => await controller.Details(Guid.Empty));
        }

        [Fact]
        public async Task Failed_TransactionNotFoundException_wrong_id()
        {
            var bookReaderRepository = new Mock<IEBookReaderRepository>();
            bookReaderRepository.Setup(x => x.GetTransaction(transactionId)).ReturnsAsync(new Transaction()
            {
                EBookReader = new EBookReader()
                {
                    EBook = new EBook()
                    {
                        Genre = new Genre(),
                        Author = new User()
                    },
                    User = new User(),
                }
            });
            var bookRepository = new Mock<IEBookRepository>().Object;
            var userRepository = new Mock<IUserRepository>().Object;

            var controller = new TransactionsController(bookReaderRepository.Object, bookRepository, userRepository);

            Assert.ThrowsAsync<TransactionNotFoundException>(async () => await controller.Details(Guid.NewGuid()));
        }

        [Fact]
        public async Task Success()
        {
            var bookReaderRepository = new Mock<IEBookReaderRepository>();
            bookReaderRepository.Setup(x => x.GetTransaction(transactionId)).ReturnsAsync(new Transaction()
            {
                EBookReader = new EBookReader()
                {
                    EBook = new EBook()
                    {
                         Genre = new Genre(),
                         Author = new User()
                    },
                    User = new User(),
                }
            });
            var bookRepository = new Mock<IEBookRepository>().Object;
            var userRepository = new Mock<IUserRepository>().Object;

            var controller = new TransactionsController(bookReaderRepository.Object, bookRepository, userRepository);

            var result = await controller.Details(transactionId);
            Assert.NotNull(result);
        }
    }
}
