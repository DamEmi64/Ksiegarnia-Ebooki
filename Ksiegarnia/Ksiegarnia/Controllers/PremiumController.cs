using Domain.DTOs;
using Domain.Entitites;
using Domain.Enums;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Application.Controllers
{
    /// <summary>
    ///     Premium controller
    /// </summary>
    [Route("Premium")]
    [ApiController]
    public class PremiumController : Controller
    {
        private readonly IUserRepository _userRepository;
        private readonly IPaymentService _paymentService;
        private readonly IEBookReaderRepository _eBookReaderRepository;

        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="userRepository"></param>
        /// <param name="paymentService"></param>
        /// <param name="eBookReaderRepository"></param>
        public PremiumController(IUserRepository userRepository,
            IPaymentService paymentService,
            IEBookReaderRepository eBookReaderRepository)
        {
            _userRepository = userRepository;
            _paymentService = paymentService;
            _eBookReaderRepository = eBookReaderRepository;
        }
        /// <summary>
        ///     Buy premium
        /// </summary>
        /// <param name="premiumData">Data about new premium membership</param>
        /// <param name="currency">currency</param>
        /// <returns></returns>
        /// <exception cref="UserNotFoundException"></exception>
        /// <exception cref="BookNotFoundException"></exception>
        /// <exception cref="BookNotVerifiedException"></exception>
        [HttpPost("buy")]
        public async Task<string> Buy([FromBody] PremiumInfoDto premiumData, [FromQuery] string currency)
        {
            if (ModelState.IsValid)
            {
                var client = await _userRepository.Get(premiumData.UserId);

                if (client == null)
                {
                    throw new UserNotFoundException(premiumData.UserId);
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
                    BuyerId = premiumData.UserId,
                    Premium = new Premium()
                    {
                        StartDate = premiumData.BuyDate,
                        DaysToFinishPremium = premiumData.Days,
                        Id = Guid.NewGuid()
                    },
                    EBookReaders = Enumerable.Empty<EBookReader>(),
                };

                var cancel = HttpContext.Request.Host + "//" + Url.Action("Finish", "Premium", values: new
                {
                    id = transaction.Id,
                    succeeded = false
                }) ?? string.Empty;
                var redirect = HttpContext.Request.Host + "//" + Url.Action("Finish", "Premium", values: new
                {
                    id = transaction.Id,
                    succeeded = true
                }) ?? string.Empty;

                var transactionDto = transaction.ToDTO();

                var url = _paymentService.GetUri(cancel, redirect, transactionDto, (decimal)0.1, false).FirstOrDefault();

                if (!string.IsNullOrEmpty(url))
                {
                    return url;
                }
            }

            throw new TransactionFailedException();
        }

        /// <summary>
        ///     Premium Buyed - redirect url
        /// </summary>
        /// <param name="id">transaction id</param>
        /// <param name="succeeded">transaction succeeded</param>
        /// <returns>Premium info - dates are utc format</returns>
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        /// <exception cref="TransactionNotFoundException">When transaction not found...</exception>
        /// <exception cref="UserNotFoundException">When user not found...</exception>
        [HttpPost("Finish/{id}")]
        public async Task<HttpStatusCode> FinishTransaction(Guid id, [FromQuery] bool succeeded = false)
        {
            if (succeeded)
            {
                var transaction = await _eBookReaderRepository.GetTransaction(id);

                if (transaction == null)
                {
                    throw new ExceptionBase(HttpStatusCode.NotFound, "Transaction not found");
                }

                var user = await _userRepository.Get(transaction.BuyerId);

                if (user == null)
                {
                    throw new UserNotFoundException(transaction.BuyerId);
                }

                user.Premium = transaction.Premium;

                await _userRepository.AddRole(user.Id, Roles.PremiumUser);

                await _userRepository.Update(user);
            }

            return HttpStatusCode.OK;
        }

        /// <summary>
        ///     Check Premium
        /// </summary>
        /// <param name="id">user id</param>
        /// <returns>Status code</returns>
        /// <exception cref="BookNotFoundException">When book not found...</exception>
        /// <exception cref="TransactionNotFoundException">When transaction not found...</exception>
        /// <exception cref="UserNotFoundException">When user not found...</exception>
        [HttpGet("{id}/Check")]
        public async Task<PremiumInfoDto> Check(string id)
        {
            var user = await _userRepository.Get(id);

            if (user == null)
            {
                throw new UserNotFoundException(id);
            }

            if (await _userRepository.CheckRole(id, Roles.PremiumUser))
            {
                if (user.Premium != null)
                {
                    var isExpired = user.Premium.StartDate.AddDays(user.Premium.DaysToFinishPremium) < DateTime.UtcNow;

                    if (isExpired)
                    {
                        await _userRepository.RemoveRole(user.Id, Roles.PremiumUser);
                    }

                    return new PremiumInfoDto()
                    {
                        BuyDate = user.Premium.StartDate,
                        Days = user.Premium.DaysToFinishPremium,
                        IsActive = !isExpired,
                        UserId = user.Id
                    };
                }
            }

            return new PremiumInfoDto()
            {
                IsActive = false,
                UserId = id
            };

        }
    }
}
