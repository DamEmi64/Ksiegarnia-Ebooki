using Microsoft.AspNetCore.Mvc;
using Domain.Entitites;
using Domain.Repositories;
using System.Net;
using Domain.Enums;
using Domain.DTOs;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;

namespace Application.Controllers
{
    /// <summary>
    ///     Transaction Controller
    /// </summary>
    [Route("Transaction")]
    [ApiController]
    public class TransactionsController : Controller
    {
        private readonly IEBookReaderRepository _eBookReaderRepository;
        private readonly IEBookRepository _eBookRepository;
        private readonly IUserRepository _userRepository;
        private readonly IPaymentService _paymentService;
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="repository">Repo</param>
        public TransactionsController(IEBookReaderRepository repository,
                                        IEBookRepository eBookRepository,
                                        IUserRepository userRepository,
                                        IPaymentService paymentService)
        {
            _eBookReaderRepository = repository;
            _eBookRepository = eBookRepository;
            _userRepository = userRepository;
            _paymentService = paymentService;
        }

        /// <summary>
        ///     Buy book
        /// </summary>
        /// <param name="buyer">Buyer</param>
        /// <param name="currency">Currency (optional)</param>
        /// <returns>Status code</returns>
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        /// <exception cref="TransactionNotFoundException">When transaction not found...</exception>
        /// <exception cref="UserNotFoundException">When user not found...</exception>
        [HttpPost("")]
        public async Task<IActionResult> Buy([FromBody] BuyerDto buyer, [FromQuery] string currency)
        {
            if (ModelState.IsValid)
            {
                var client = await _userRepository.Get(buyer.BuyerId);

                if (client == null)
                {
                    throw new UserNotFoundException(buyer.BuyerId);
                }

                var readers = new List<EBookReader>();
                foreach (var bookId in buyer.BookIds)
                {
                    var book = await _eBookRepository.Get(Guid.TryParse(bookId, out Guid id) ? id : Guid.Empty);

                    if (book == null)
                    {
                        throw new BookNotFoundException(bookId);
                    }

                    if (!book.Verified)
                    {
                        throw new BookNotVerifiedException();
                    }

                    readers.Add(new EBookReader()
                    {
                        BookId = book.Id,
                        EBook = book,
                        User = client
                    });
                }

                var currencyEnum = Currency.PLN;

                if (Enum.TryParse(currency, out Currency currencyValue))
                {
                    currencyEnum = currencyValue;
                }
                var transaction = new Transaction()
                {
                    Currency = currencyEnum,
                    DateTime = DateTime.UtcNow,
                    Id = Guid.NewGuid(),
                    EBookReaders = readers
                };

                await _eBookReaderRepository.Add(transaction);
                await _eBookReaderRepository.SaveChanges();

                var cancel = Url.Action("Finish", "Transaction", new { id = Guid.Empty, succeeded = false }) ?? string.Empty;
                var redirect = Url.Action("Finish", "Transaction", new { id = transaction.Id, succeeded = true }) ?? string.Empty;

                var transactionDto = transaction.ToDTO();

                var url = _paymentService.GetUri(cancel, redirect, transactionDto,(decimal)0.1);

                return Redirect(url);
            }

            return BadRequest();
        }

        /// <summary>
        ///     Book buyed - redirect uri
        /// </summary>
        /// <param name="id">transaction id</param>
        /// <param name="succeeded">transaction succeeded</param>
        /// <returns>Status code</returns>
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        /// <exception cref="TransactionNotFoundException">When transaction not found...</exception>
        /// <exception cref="UserNotFoundException">When user not found...</exception>
        [HttpPost("Finish/{id}")]
        public async Task<HttpStatusCode> FinishTransaction(Guid id, [FromQuery] bool succeeded = false)
        {
            var reader = await _eBookReaderRepository.GetTransaction(id);

            if (reader != null)
            {
                reader.Finished = true;
            }

            await _eBookReaderRepository.SaveChanges();

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Get all transactions
        /// </summary>
        /// <param name="userId">User id, WARNING!!! User shouldn't have access to that</param>
        /// <returns></returns>
        [HttpGet("")]
        public List<TransactionDto> GetAll([FromQuery] string userId)
        {
            return _eBookReaderRepository.GetTransactions(userId).ToDTOs().ToList();
        }

        /// <summary>
        ///     Get details about transaction by id
        /// </summary>
        /// <param name="id">transaction Id</param>
        /// <returns>Transaction data</returns>
        /// <exception cref="TransactionNotFoundException">When transaction not found...</exception>
        [HttpGet("{id}")]
        public async Task<TransactionDto> Details(Guid id)
        {
            var transaction = await _eBookReaderRepository.GetTransaction(id);

            if (transaction == null)
            {
                throw new TransactionNotFoundException();
            }

            return transaction.ToDTO();
        }

    }
}
