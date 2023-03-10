using Microsoft.AspNetCore.Mvc;
using Domain.Entitites;
using Domain.Repositories;
using System.Net;
using Domain.Enums;
using Domain.DTOs;

namespace Application.Controllers
{
    /// <summary>
    ///     Transaction Controller
    /// </summary>
    [Route("Transaction")]
    [ApiController]
    public class TransactionController : Controller
    {
        private readonly IEBookReaderRepository _eBookReaderRepository;
        private readonly IEBookRepository _eBookRepository;
        private readonly IUserRepository _userRepository;
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="repository">Repo</param>
        public TransactionController(IEBookReaderRepository repository, IEBookRepository eBookRepository, IUserRepository userRepository)
        {
            _eBookReaderRepository = repository;
            _eBookRepository = eBookRepository;
            _userRepository = userRepository;
        }

        /// <summary>
        ///     Buy book
        /// </summary>
        /// <param name="buyer">Buyer</param>
        /// <param name="bookIds">Ebook Ids</param>
        /// <param name="currency">Currency (optional)</param>
        /// <returns>Status code</returns>
        [HttpPost("Buy/{bookId}")]
        [ValidateAntiForgeryToken]
        public async Task<HttpStatusCode> Buy([FromBody] BuyerDto buyer, [FromQuery] string currency)
        {
            foreach (var bookId in buyer.BookIds)
            {
                var book = await _eBookRepository.GetEbook(new Guid(bookId));
                if (ModelState.IsValid && book != null)
                {
                    var currencyEnum = Currency.PLN;

                    if (Enum.TryParse(currency, out Currency currencyValue))
                    {
                        currencyEnum = currencyValue;
                    }
                    var transaction = new Transaction()
                    {
                        Currency = currencyEnum,
                        DateTime = DateTime.UtcNow,
                        Id = Guid.NewGuid()
                    };

                    var reader = new EBookReader()
                    {
                        BookId = book.Id,
                        EBook = book,
                        User = await _userRepository.Get(buyer.BuyerId),
                        Transaction = transaction
                    };

                    await _eBookReaderRepository.CreateTransaction(transaction);
                    await _eBookReaderRepository.SaveChanges();
                }
            }

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Get details about transaction by id
        /// </summary>
        /// <param name="id">transaction Id</param>
        /// <returns>Transaction data</returns>
        [HttpGet("{id}")]
        public async Task<Transaction> Details(Guid id)
        {
            return (await _eBookReaderRepository.GetTransaction(id));
        }

    }
}
