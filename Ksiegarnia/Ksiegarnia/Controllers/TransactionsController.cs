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
        private readonly ISmtpService _smtpService;
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
                                        IPaymentService paymentService,
                                        ISmtpService smtpService)
        {
            _eBookReaderRepository = repository;
            _eBookRepository = eBookRepository;
            _userRepository = userRepository;
            _paymentService = paymentService;
            _smtpService = smtpService;
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
                    TransactionType.Wallet => await BuyViaWallet(buyer),
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
                var cancel = Url.Action(nameof(FinishDistinct), "Transactions", values: new { id = userId, successed = false, no = numberOfDistinction }, Request.Scheme) ?? string.Empty;
                var redirect = Url.Action(nameof(FinishDistinct), "Transactions", values: new { id = userId, successed = true, no = numberOfDistinction }, Request.Scheme) ?? string.Empty;

                var url = _paymentService.GetUri(cancel, redirect, "Zakup wyróżnień", numberOfDistinction * ConfigurationConst.PrizeForDistinct).FirstOrDefault();

                if (!string.IsNullOrEmpty(url))
                {
                    return url;
                }

            }

            throw new TransactionFailedException();
        }

        /// <summary>
        ///     Wallet - send cash
        /// </summary>
        /// <param name="sendCash">cash info</param>
        /// <returns>Status code</returns>
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        /// <exception cref="TransactionNotFoundException">When transaction not found...</exception>
        /// <exception cref="UserNotFoundException">When user not found...</exception>
        [HttpPost("wallet")]
        public async Task<string> BuyDistinct([FromBody] SendCashDto sendCash)
        {
            if (ModelState.IsValid)
            {
                var client = await _userRepository.Get(sendCash.UserId);

                if (client == null)
                {
                    throw new UserNotFoundException(sendCash.UserId);
                }

                var cancel = Url.Action(nameof(FinishWallet), "Transactions", values: new { id = sendCash.UserId, successed = false, cash = sendCash.Cash }, Request.Scheme) ?? string.Empty;
                var redirect = Url.Action(nameof(FinishWallet), "Transactions", values: new { id = sendCash.UserId, successed = true, cash = sendCash.Cash }, Request.Scheme) ?? string.Empty;

                var url = _paymentService.GetUri(cancel, redirect, "Doładowanie portfela", sendCash.Cash).FirstOrDefault();

                if (!string.IsNullOrEmpty(url))
                {
                    return url;
                }
            }

            throw new TransactionFailedException();
        }

        /// <summary>
        ///     Finish sending cash to wallet
        /// </summary>
        /// <returns></returns>
        /// <exception cref="ExceptionBase"></exception>
        [HttpGet("FinishWallet/{id}")]
        public async Task<HttpStatusCode> FinishWallet(string id, [FromQuery] bool successed, [FromBody] decimal cash, [FromQuery] string? paymentId = "", [FromQuery] string? token = "", [FromQuery] string? PayerID = "")
        {
            if (successed && _paymentService.Execute(paymentId, PayerID))
            {
                var user = await _userRepository.Get(id);

                if (user != null)
                {
                    user.Wallet += cash;

                    await _userRepository.Update(user);
                }
            }

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Finish buying distinction
        /// </summary>
        /// <returns></returns>
        /// <exception cref="ExceptionBase"></exception>
        [HttpGet("FinishDistinct/{id}")]
        public async Task<IActionResult> FinishDistinct(string id, [FromQuery] bool successed, [FromQuery] int no, [FromQuery] string? paymentId = "", [FromQuery] string? token = "", [FromQuery] string? PayerID = "")
        {
            if (successed && _paymentService.Execute(paymentId, PayerID))
            {
                var user = await _userRepository.Get(id);

                if (user != null)
                {
                    user.Distinctions += no;

                    await _userRepository.Update(user);
                }

                return Redirect(new UriBuilder()
                {
                    Scheme = Request.Scheme,
                    Host = Request.Host.Host,
                    Port = Request.Host.Port ?? -1,
                    Path = "TransactionEnd",
                    Query = "success=true"
                }.ToString());
            }

            return Redirect(new UriBuilder()
            {
                Scheme = Request.Scheme,
                Host = Request.Host.Host,
                Port = Request.Host.Port ?? -1,
                Path = "TransactionEnd",
                Query = "success=false"
            }.ToString());
        }

        private async Task<string> BuyViaWallet(BuyerDto buyer)
        {
            var client = await _userRepository.Get(buyer.BuyerId);
            var readers = new List<EBookReader>();

            var buyed = new List<BookDto>();
            var sum = Decimal.Zero;

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

                if (book.Promotion != null && book.Promotion.EndDate > DateTime.Now)
                {
                    sum += book.Promotion.Prize;
                }
                else
                {
                    sum += book.Prize;
                }
            }

            sum += sum * ConfigurationConst.Commission;

            if (sum > client.Wallet)
            {
                throw new WalletIsNotEnoughException();
            }

            var transaction = new Transaction()
            {
                Currency = Currency.PLN,
                DateTime = DateTime.UtcNow,
                Id = Guid.NewGuid(),
                BuyerId = buyer.BuyerId,
                EBookReaders = readers
            };


            client.Wallet -= sum;

            await _userRepository.Update(client);

            await _eBookReaderRepository.Add(transaction);
            await _eBookReaderRepository.SaveChanges();

            var cache = "";
            foreach (var buy in buyed)
            {
                cache += " " + buy.Title;
            }

            return $"Zakupiono przez portfel:{cache}";
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
                
                var cancel = Url.Action(nameof(FinishTransaction), "Transactions", values: new { id = transaction.Id, succeessed = false }, Request.Scheme, Request.Host.Value) ?? string.Empty;
                var redirect = Url.Action(nameof(FinishTransaction), "Transactions", values: new { id = transaction.Id, succeessed = true }, Request.Scheme, Request.Host.Value) ?? string.Empty;

                var transactionDto = transaction.ToDTO();

                var url = _paymentService.GetUri(cancel, redirect, transactionDto, ConfigurationConst.Commission, false).FirstOrDefault();

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
        [HttpGet("Finish/{id}")]
        public async Task<IActionResult> FinishTransaction(Guid id, [FromQuery] bool succeessed = false, [FromQuery] string? paymentId = "", [FromQuery] string? token = "", [FromQuery] string? PayerID = "")

        {
            var transaction = await _eBookReaderRepository.GetTransaction(id);

            if (succeessed)
            {
                if (transaction != null && _paymentService.Execute(paymentId, PayerID))
                {
                    foreach (var book in transaction.EBookReaders.Select(x => x.EBook))
                    {
                        if (book.Promotion != null)
                        {

                            book.Author.Wallet += book.Promotion.Prize;
                        }
                        else
                        {

                            book.Author.Wallet += book.Prize;
                        }

                        await _userRepository.Update(book.Author);
                    }

                    transaction.Finished = true;

                    await _eBookReaderRepository.SaveChanges();

                    return Redirect(new UriBuilder()
                    {
                        Scheme = Request.Scheme,
                        Host = Request.Host.Host,
                        Port = Request.Host.Port ?? -1,
                        Path = "TransactionEnd",
                        Query = "success=true"
                    }.ToString());
                }
                else
                {
                    _eBookReaderRepository.CleanTransaction(transaction);
                    await _eBookReaderRepository.SaveChanges();

                    return Redirect(new UriBuilder()
                    {
                        Scheme = Request.Scheme,
                        Host = Request.Host.Host,
                        Port = Request.Host.Port ?? -1,
                        Path = "TransactionEnd",
                        Query = "success=false"
                    }.ToString());
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

            return Redirect(new UriBuilder()
            {
                Scheme = Request.Scheme,
                Host = Request.Host.Host,
                Port = Request.Host.Port ?? -1,
                Path = "TransactionEnd",
                Query = "success=false"
            }.ToString());
        }


        /// <summary>
        ///     Send cash
        /// </summary>
        /// <param name="id">transaction id</param>
        /// <param name="succeeded">transaction succeeded</param>
        /// <returns>Status code</returns>
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        /// <exception cref="TransactionNotFoundException">When transaction not found...</exception>
        /// <exception cref="UserNotFoundException">When user not found...</exception>
        [HttpPost("")]
        public async Task SendCash([FromBody] SendCashDto sendCash)
        {
            var transaction = new Transaction()
            {
                Currency = sendCash.Currency,
                DateTime = DateTime.UtcNow,
                Id = Guid.NewGuid(),
                BuyerId = sendCash.UserId,

            };

            var user = await _userRepository.Get(sendCash.UserId);

            if (user == null)
            {
                throw new UserNotFoundException(sendCash.UserId);
            }

            var cancel = Url.Action(nameof(FinishSendingCash), "Transactions", values: new { id = transaction.Id, succeeded = false, cash = sendCash.Cash }, Request.Scheme, Request.Host.Value) ?? string.Empty;
            var redirect = Url.Action(nameof(FinishSendingCash), "Transactions", values: new { id = transaction.Id, succeeded = true, cash = sendCash.Cash }, Request.Scheme, Request.Host.Value) ?? string.Empty;


            _smtpService.SendEmail($"Wypłata środków: User:{user.Email}\nCash:{sendCash.Cash}", ConfigurationConst.SMTP.Email, "WYPŁATA");
            //var url = _paymentService.GetUri(cancel, redirect, $"Wypłata pieniędzy {sendCash.Cash}", sendCash.Cash, user.Email).FirstOrDefault();

            return;
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
        [HttpGet("SendCashFinish/{id}")]
        public async Task<IActionResult> FinishSendingCash(Guid id, [FromBody] decimal cash = 0, [FromQuery] bool succeeded = false, [FromQuery] string? paymentId = "", [FromQuery] string? token = "", [FromQuery] string? PayerID = "")
        {
            var transaction = await _eBookReaderRepository.GetTransaction(id);

            if (succeeded)
            {
                if (transaction != null && _paymentService.Execute(paymentId, PayerID))
                {
                    transaction.Finished = true;

                    var client = await _userRepository.Get(transaction.BuyerId);

                    client.Wallet -= cash;

                    await _userRepository.Update(client);

                    await _eBookReaderRepository.SaveChanges();
                }
                else
                {
                    throw new ExceptionBase(HttpStatusCode.BadRequest, "Transaction failed");
                }

                await _eBookReaderRepository.SaveChanges();

                return Redirect(new UriBuilder()
                {
                    Scheme = Request.Scheme,
                    Host = Request.Host.Host,
                    Port = Request.Host.Port ?? -1,
                    Path = "TransactionEnd",
                    Query = "success=true"
                }.ToString());
            }
            else
            {
                if (transaction != null)
                {
                    _eBookReaderRepository.Remove(transaction);
                    await _eBookRepository.SaveChanges();
                }

                return Redirect(new UriBuilder()
                {
                    Scheme = Request.Scheme,
                    Host = Request.Host.Host,
                    Port = Request.Host.Port ?? -1,
                    Path = "TransactionEnd",
                    Query = "success=false"
                }.ToString());
            }
        }

        /// <summary>
        ///     Get user transactions summary (selled and buyed books)
        /// </summary>
        /// <param name="id">user id</param>
        /// <param name="page">page</param>
        /// <param name="pageSize">page size</param>
        /// <returns></returns>
        [HttpGet("{id}/summary")]
        public object GetSummary(string id)
        {
            var buying = _eBookReaderRepository.GetTransactions(id).ToDTOs().ToList();

            var buyingCash = GetCash(buying);

            var selling = _eBookReaderRepository.GetTransactions(id, true).ToDTOs().ToList();
            var sellingCash = GetCash(selling);

            return new
            {
                buyed_books = buying,
                cash_spend_on_buying = buyingCash,
                selled_book = selling,
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
                    cash += book.Prize ?? 0;
                }
            }

            return cash;
        }
    }
}
