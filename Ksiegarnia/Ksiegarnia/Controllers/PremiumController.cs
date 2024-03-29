﻿using Domain.DTOs;
using Domain.Entitites;
using Domain.Enums;
using Domain.Repositories;
using Infrastructure;
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

                if (premiumData.Days <= 0)
                {
                    throw new ExceptionBase(HttpStatusCode.BadRequest, "Days is equal or less zero");
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
                        Id = Guid.NewGuid(),
                        User = client
                    },
                    EBookReaders = Enumerable.Empty<EBookReader>(),
                };

                var cancel = Url.Action(nameof(FinishTransaction), "Premium", values: new
                {
                    id = transaction.Id,
                    succeeded = false,
                }, HttpContext.Request.Scheme, HttpContext.Request.Host.Value) ?? string.Empty;

                var redirect = Url.Action(nameof(FinishTransaction), "Premium", values: new
                {
                    id = transaction.Id,
                    succeeded = true,
                }, HttpContext.Request.Scheme, HttpContext.Request.Host.Value) ?? string.Empty;

                var transactionDto = transaction.ToDTO();
                var url = _paymentService.GetUri(cancel, redirect, "Kupienie premium", premiumData.Prize).FirstOrDefault();
                
                await _eBookReaderRepository.Add(transaction);
                await _eBookReaderRepository.SaveChanges();
                
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
        [HttpGet("Finish/{id}")]
        public async Task<IActionResult> FinishTransaction(Guid id, [FromQuery] string? paymentId = "", [FromQuery] string? token = "", [FromQuery] string? PayerID = "", [FromQuery] bool succeeded = false)
        {
            var transaction = await _eBookReaderRepository.GetTransaction(id);

            if (transaction == null)
            {
                throw new TransactionNotFoundException();
            }

            if (succeeded && _paymentService.Execute(paymentId, PayerID))
            {
                var user = await _userRepository.Get(transaction.BuyerId);

                if (user == null)
                {
                    throw new UserNotFoundException(transaction.BuyerId);
                }

                await _userRepository.AddRole(user.Id, Roles.PremiumUser);


                transaction.Finished = true;

                await _eBookReaderRepository.SaveChanges();

                await _userRepository.Update(user);

                return Redirect(new UriBuilder()
                {
                    Scheme = Request.Scheme,
                    Host = Request.Host.Host,
                    Port = 44489,
                    Path = "TransactionEnd",
                    Query = "success=true&type=premium"
                }.ToString());
            }
            else
            {
                _eBookReaderRepository.CleanTransaction(transaction);

                await _eBookReaderRepository.SaveChanges();
            }

            return Redirect(new UriBuilder()
            {
                Scheme = Request.Scheme,
                Host = Request.Host.Host,
                Port = 44489,
                Path = "TransactionEnd",
                Query = "success=false&type=premium"
            }.ToString());
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

            var premium = await _userRepository.GetPremium(user.Id);

            if (await _userRepository.CheckRole(id, Roles.PremiumUser) || premium != null)
            {
                if (premium != null)
                {
                    var isExpired = premium.StartDate.AddDays(premium.DaysToFinishPremium) < DateTime.UtcNow;

                    if (isExpired)
                    {
                        await _userRepository.RemoveRole(user.Id, Roles.PremiumUser);
                    }
                    else if (!(await _userRepository.CheckRole(id, Roles.PremiumUser)))
                    {
                        await _userRepository.AddRole(user.Id, Roles.PremiumUser);
                        await _userRepository.Update(user);
                    }

                    return new PremiumInfoDto()
                    {
                        BuyDate = premium.StartDate,
                        Days = premium.DaysToFinishPremium,
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