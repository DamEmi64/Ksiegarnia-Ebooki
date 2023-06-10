using Microsoft.AspNetCore.Mvc;
using Domain.Entitites;
using Domain.Repositories;
using System.Net;
using Domain.Enums;
using Domain.DTOs;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;
using Newtonsoft.Json;
using Infrastructure;

namespace Application.Controllers
{
    /// <summary>
    ///     Transaction Controller
    /// </summary>
    [Route("Transactions")]
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
        /// <param name="eBookRepository"></param>
        /// <param name="userRepository"></param>
        /// <param name="paymentService"></param>
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
        /// <param name="tokens">Gift tokens (optional)</param>
        /// <param name="transactionType">Transaction type</param>
        /// <returns>Status code</returns>
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        /// <exception cref="TransactionNotFoundException">When transaction not found...</exception>
        /// <exception cref="UserNotFoundException">When user not found...</exception>
        [HttpPost("buy")]
        public async Task<string> Buy([FromBody] BuyerDto buyer, [FromQuery] TransactionType transactionType, [FromQuery] string? currency = null, [FromQuery] List<string>? tokens = null)
        {
            try
            {
                return transactionType switch
                {
                    TransactionType.Token => await BuyViaToken(buyer, tokens ?? new()),
                    TransactionType.Paypal => await BuyViaPaypal(buyer, currency ?? string.Empty),
                    _ => await BuyViaToken(buyer, tokens ?? new()),
                };
            }
            catch (PayPal.PaymentsException e)
            {
                var list = new List<string>();

                foreach (var detail in e.Details.details)
                {
                    list.Add(detail.issue);
                }

                throw new TransactionFailedException(list);
            }
            catch (Exception)
            {
                throw new TransactionFailedException();
            }
        }

        /// <summary>
        ///     Buy distinction
        /// </summary>
        /// <returns>Status code</returns>
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        /// <exception cref="TransactionNotFoundException">When transaction not found...</exception>
        /// <exception cref="UserNotFoundException">When user not found...</exception>
        [HttpPost("distinct/buy")]
        public async Task<string> BuyDistinct([FromBody] int numberOfDistinction, [FromQuery] string userId)
        {
            if (ModelState.IsValid)
            {
                var client = await _userRepository.Get(userId);

                if (client == null)
                {
                    throw new UserNotFoundException(userId);
                }

                var cancel = HttpContext.Request.Host + "//" + Url.Action("FinishDistinct", "Transactions", values: new { id = userId, succeeded = false }) ?? string.Empty;
                var redirect = HttpContext.Request.Host + "//" + Url.Action("FinishDistinct", "Transactions", values: new { id = userId, succeeded = true }) ?? string.Empty;


                var url = _paymentService.GetUri(cancel, redirect, "Zakup wyróżnień", numberOfDistinction * ConfigurationConst.PrizeForDistinct).FirstOrDefault();

                if (!string.IsNullOrEmpty(url))
                {
                    return url;
                }
            }

            throw new TransactionFailedException();
        }

        /// <summary>
        ///     Finish buying distinction
        /// </summary>
        /// <returns></returns>
        /// <exception cref="ExceptionBase"></exception>
        [HttpPost("FinishDistinct/{id}")]
        public async Task<HttpStatusCode> FinishDistinct(string id, [FromQuery] bool successed, [FromQuery] int no)
        {
            if (successed)
            {
                var user = await _userRepository.Get(id);
                
                if (user != null)
                {
                    user.Distinctions += no;

                    await _userRepository.Update(user);
                }
            }

            return HttpStatusCode.OK;
        }

        private async Task<string> BuyViaToken(BuyerDto buyer, List<string> tokens)
        {
            var client = await _userRepository.Get(buyer.BuyerId);
            var readers = new List<EBookReader>();

            var buyed = new List<BookDto>();

            foreach (var bookId in buyer.BookIds)
            {
                var book = await _eBookRepository.Get(Guid.TryParse(bookId, out Guid id) ? id : Guid.Empty);

                if (book == null)
                {
                    throw new BookNotFoundException(bookId);
                }

                if (book.Verification != VerificationType.Accepted)
                {
                    throw new BookNotVerifiedException();
                }

                var tokensFromBase = JsonConvert.DeserializeObject<List<string>>(book.Tokens ?? string.Empty);

                if (tokensFromBase != null)
                {
                    var token = tokensFromBase.FirstOrDefault(x => tokens.Contains(x));

                    if (!string.IsNullOrEmpty(token))
                    {
                        tokensFromBase.Remove(token);
                        book.Tokens = JsonConvert.SerializeObject(tokensFromBase);
                        buyed.Add(book.ToDTO());
                        await _eBookRepository.SaveChanges();

                        readers.Add(new EBookReader()
                        {
                            BookId = book.Id,
                            EBook = book,
                            User = client
                        });
                    }
                }
            }

            var transaction = new Transaction()
            {
                Currency = Currency.Token,
                DateTime = DateTime.UtcNow,
                Id = Guid.NewGuid(),
                BuyerId = buyer.BuyerId,
                EBookReaders = readers
            };

            await _eBookReaderRepository.Add(transaction);
            await _eBookReaderRepository.SaveChanges();

            var cache = "";
            foreach (var buy in buyed)
            {
                cache += " " + buy.Title;
            }

            return $"Zakupiono przez tokeny:{cache}";
        }

        private async Task<string> BuyViaPaypal(BuyerDto buyer, string currency)
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

                    if (book.Verification != VerificationType.Accepted)
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
                    BuyerId = buyer.BuyerId,
                    EBookReaders = readers
                };

                var cancel = HttpContext.Request.Host + "//" + Url.Action("Finish", "Transactions", values: new { id = transaction.Id, succeeded = false }) ?? string.Empty;
                var redirect = HttpContext.Request.Host + "//" + Url.Action("Finish", "Transactions", values: new { id = transaction.Id, succeeded = true }) ?? string.Empty;

                var transactionDto = transaction.ToDTO();

                var url = _paymentService.GetUri(cancel, redirect, transactionDto, (decimal)0.1, false).FirstOrDefault();

                if (!string.IsNullOrEmpty(url))
                {
                    await _eBookReaderRepository.Add(transaction);
                    await _eBookReaderRepository.SaveChanges();
                    return url;
                }
            }

            throw new TransactionFailedException();
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
            var transaction = await _eBookReaderRepository.GetTransaction(id);

            if (succeeded)
            {
                if (transaction != null)
                {
                    var cancel = HttpContext.Request.Host + "//" + Url.Action("FinishToUser", "Transactions", values: new { id = id, succeeded = false }) ?? string.Empty;
                    var redirect = HttpContext.Request.Host + "//" + Url.Action("FinishToUser", "Transactions", values: new { id = id, succeeded = true }) ?? string.Empty;

                    var transactionDto = (await _eBookReaderRepository.GetTransaction(id)).ToDTO();

                    var urls = _paymentService.GetUri(cancel, redirect, transactionDto, (decimal)0.1, true);

                    foreach (var url in urls)
                    {
                        using (var client = new HttpClient())
                        {
                            var response = await client.SendAsync(new(HttpMethod.Get, url));

                            if (response.IsSuccessStatusCode)
                            {
                                throw new ExceptionBase(HttpStatusCode.BadRequest, "Transaction failed - sending money to author");
                            }
                        }
                    }
                }
                else
                {
                    throw new ExceptionBase(HttpStatusCode.BadRequest, "Transaction failed");
                }

                await _eBookReaderRepository.SaveChanges();
            }
            else
            {
                if (transaction != null)
                {
                    _eBookReaderRepository.Remove(transaction);
                    await _eBookRepository.SaveChanges();
                }
            }

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Book buyed - redirect uri (cash to user)
        /// </summary>
        /// <param name="id">transaction id</param>
        /// <param name="succeeded">transaction succeeded</param>
        /// <returns>Status code</returns>
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        /// <exception cref="TransactionNotFoundException">When transaction not found...</exception>
        /// <exception cref="UserNotFoundException">When user not found...</exception>
        [HttpPost("FinishToUser/{id}")]
        public async Task<HttpStatusCode> FinishSendingCashToUser(Guid id, [FromQuery] bool succeeded = false)
        {
            if (succeeded)
            {
                var reader = await _eBookReaderRepository.GetTransaction(id);

                if (reader != null)
                {
                    reader.Finished = true;
                }

                await _eBookReaderRepository.SaveChanges();
            }
            else
            {
                throw new ExceptionBase(HttpStatusCode.BadRequest, "Send cash to user failed.");
            }

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Get user transactions summary (selled and buyed books)
        /// </summary>
        /// <param name="id">user id</param>
        /// <param name="page">page</param>
        /// <param name="pageSize">page size</param>
        /// <returns></returns>
        [HttpGet("{id}/summary")]
        public object GetSummary(string id,
                    [FromQuery] int page = 1,
                    [FromQuery] int pageSize = 100)
        {
            var buying = _eBookReaderRepository.GetTransactions(id).ToDTOs().ToList();

            var buyingCash = GetCash(buying);

            var selling = _eBookReaderRepository.GetTransactions(string.Empty)
                            .Where(x => x.EBookReaders != null && x.EBookReaders.Any(x => x.EBook?.Author.Id == id)).ToDTOs().ToList();

            var sellingCash = GetCash(selling);

            return new
            {
                buyed_books = Paging(buying, page, pageSize),
                cash_spend_on_buying = buyingCash,
                selled_book = Paging(selling, page, pageSize),
                earned_cash = sellingCash
            };
        }

        /// <summary>
        ///     Get all transactions
        /// </summary>
        /// <param name="userId">User id</param>
        /// <param name="authorId">Author id</param>
        /// <param name="page">Page</param>
        /// <param name="pageSize">Page size</param>
        /// <returns></returns>
        [HttpGet("")]
        public object GetAll([FromQuery] string userId = "",
                            [FromQuery] string? authorId = "",
                            [FromQuery] int page = 1,
                            [FromQuery] int pageSize = 100)
        {
            var result = new List<TransactionDto>();
            if (string.IsNullOrEmpty(authorId))
            {
                result = _eBookReaderRepository.GetTransactions(userId).ToDTOs().ToList();
            }
            else
            {
                var list = _eBookReaderRepository.GetTransactions(userId);

                if (string.IsNullOrEmpty(userId))
                {
                    result = list.Where(x => x.EBookReaders != null && x.EBookReaders.Any(x => x.EBook?.Author?.Id == authorId)).ToDTOs().OrderBy(x => x.Date).ToList();
                }
            }

            return Paging(result, page, pageSize);
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


        private object Paging(List<TransactionDto> transactionDtos, int page, int pageSize)
        {
            if (page <= 0)
            {
                page = 0;
            }
            else
            {
                page--;
            }

            var count = transactionDtos.Count() - page * pageSize;

            if (count > pageSize)
            {
                return new { all = transactionDtos.Count, page = page + 1, number_of_pages = transactionDtos.Count / pageSize + 1, result = transactionDtos.GetRange(page * pageSize, pageSize) };
            }
            else
            {
                return new { all = transactionDtos.Count, page = page + 1, number_of_pages = transactionDtos.Count / pageSize + 1, result = transactionDtos.GetRange(page * pageSize, count) };
            }
        }

        private decimal GetCash(List<TransactionDto> transactionDtos)
        {
            decimal cash = 0;
            foreach (var transaction in transactionDtos)
            {
                foreach (var book in transaction.Books)
                {
                    cash += book.Prize;
                }
            }

            return cash;
        }
    }
}
