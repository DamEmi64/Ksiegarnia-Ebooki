using Domain.DTOs;
using Domain.Repositories;
using Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using PayPal.Api;
using System.Globalization;
using System.Threading.Tasks;

namespace Infrastructure.Services.Paypal
{
    /// <summary>
    ///     Paypal service
    /// </summary>
    public partial class PaypalService : IPaymentService
    {

        private readonly IUserRepository _userRepository;

        public PaypalService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        /// <summary>
        ///     Run payment service - generate payment uri
        /// </summary>
        /// <param name="cancelUri">uri for cancel</param>
        /// <param name="redirectUri">uri to redirect</param>
        /// <param name="transaction">transaction id</param>
        /// <param name="commission">commission</param>
        public IEnumerable<string> GetUri(string cancelUri, string redirectUri, TransactionDto transaction, decimal commission, bool isForUser)
        {
            var context = GetAPIContext(GetAccessToken());

            if (transaction != null)
            {
                Payment payment;
                if (isForUser)
                {
                    foreach (var book in transaction.Books)
                    {
                        payment = Task.Run(async () => await CreatePaymentForUser(context, redirectUri, cancelUri, book, transaction.Currency)).Result;

                        var links = payment.links.GetEnumerator();

                        while (links.MoveNext())
                        {
                            var link = links.Current;
                            if (link.rel.ToLower().Equals("approval_url"))
                            {
                                yield return link.href;
                            }
                        }
                    }
                }
                else
                {
                    payment = Task.Run(async() => await CreatePayment(context, redirectUri, cancelUri, transaction, commission)).Result;

                    var links = payment.links.GetEnumerator();

                    while (links.MoveNext())
                    {
                        var link = links.Current;
                        if (link.rel.ToLower().Equals("approval_url"))
                        {
                            yield return link.href;
                        }
                    }
                }
            }
        }

        public IEnumerable<string> GetUri(string cancelUri, string redirectUri, string title, decimal cash, string? payee = null)
        {
            var context = GetAPIContext(GetAccessToken());
            Payment payment;

            if (!string.IsNullOrEmpty(payee))
            {
                payment = Task.Run(async () => await CreatePaymentForUser(context, redirectUri, cancelUri, payee, cash, title, Domain.Enums.Currency.PLN)).Result;

                var links = payment.links.GetEnumerator();


                while (links.MoveNext())
                {
                    var link = links.Current;
                    if (link.rel.ToLower().Equals("approval_url"))
                    {
                        yield return link.href;
                    }
                }

            }
            else
            {
                payment = CreatePayment(context, redirectUri, cancelUri, ConfigurationConst.Paypal.Email, title, cash);

                var links = payment.links.GetEnumerator();

                while (links.MoveNext())
                {
                    var link = links.Current;
                    if (link.rel.ToLower().Equals("approval_url"))
                    {
                        yield return link.href;
                    }
                }
            }

        }

        /// <summary>
        ///     Execute payment
        /// </summary>
        /// <param name="paymentId"></param>
        /// <returns></returns>
        public bool Execute(string paymentId, string payerId)
        {
            var context = GetAPIContext(GetAccessToken());

            var paymentExe = new PaymentExecution()
            {
                payer_id = payerId,
            };
            var payment = new Payment()
            {
                id = paymentId
            };

            return payment.Execute(context, paymentExe).state.ToLower().Equals("approved");
        }

        /// <summary>
        ///     Create payment
        /// </summary>
        /// <param name="apiContext">api context</param>
        /// <param name="redirectUri">redirect uri</param>
        /// <param name="cancelUri">cancel uri</param>
        /// <param name="transaction">Transaction</param>
        /// <param name="commission">commision where 10 % is 0.1</param>
        /// <returns></returns>
        public async Task<Payment> CreatePayment(APIContext apiContext, string redirectUri, string cancelUri, TransactionDto transaction, decimal commission)
        {
            var payer = new Payer()
            {
                payment_method = "paypal",
                payer_info = new PayerInfo()
                {
                    country_code="PL",
                    email = ConfigurationConst.Paypal.Email
                }
            };

            var itemlist = new ItemList()
            {
                items = new List<Item>()
            };

            decimal currency = 0;

            foreach (var book in transaction.Books)
            {
                var prize = Decimal.Zero;

                if (book.Promotion != null && book.Promotion.EndDate > DateTime.Now && !book.Promotion.IsPremiumOnly)
                {
                    prize = book.Promotion.Prize;
                }
                else if (book.Promotion != null && book.Promotion.EndDate > DateTime.Now && book.Promotion.IsPremiumOnly && await _userRepository.CheckRole(transaction.Buyer.Id,Domain.Enums.Roles.PremiumUser))
                {
                    prize = book.Promotion.Prize;
                }
                else
                {
                    prize = Math.Round(book.Prize.Value);
                }

                currency += prize;
                itemlist.items.Add(new Item()
                {
                    name = book.Title,
                    currency = transaction.Currency.ToString(),
                    quantity = "1",
                    sku = "asd",
                    price = Math.Round(prize, 2).ToString(CultureInfo.InvariantCulture),
                });

            }

            itemlist.items.Add(new Item()
            {
                name = "Prowizja",
                currency  = Domain.Enums.Currency.PLN.ToString(),
                quantity = "1",
                sku = "asd",
                price = Math.Round(currency*commission, 2).ToString(CultureInfo.InvariantCulture),
            });

            currency += currency * commission;

            var urls = new RedirectUrls()
            {
                cancel_url = cancelUri,
                return_url = redirectUri
            };

            var amount = new Amount()
            {
                currency = transaction.Currency.ToString(),
                total = Math.Round(currency, 2).ToString(CultureInfo.InvariantCulture)
            };

            var transactionPaypal = new List<Transaction>();
            transactionPaypal.Add(new Transaction()
            {
                description = itemlist.items.Count > 1 ? "Zakup książek - ebookWorld" : "Zakup książki - ebookWorld",
                invoice_number = Guid.NewGuid().ToString(),
                amount = amount,
                item_list = itemlist
            });

            var payment = new Payment()
            {
                payer = payer,
                redirect_urls = urls,
                intent = "sale",
                transactions = transactionPaypal
            };

            return payment.Create(apiContext);
        }

        /// <summary>
        ///     Create payment
        /// </summary>
        /// <param name="apiContext">api context</param>
        /// <param name="redirectUri">redirect uri</param>
        /// <param name="cancelUri">cancel uri</param>
        /// <param name="transaction">Transaction</param>
        /// <param name="commission">commision where 10 % is 0.1</param>
        /// <returns></returns>
        public Payment CreatePayment(APIContext apiContext, string redirectUri, string cancelUri, string payerUser, string title, decimal cash)
        {
            var payer = new Payer()
            {
                payment_method = "paypal"
            };

            var itemlist = new ItemList()
            {
                items = new List<Item>()
            };

            itemlist.items.Add(new Item()
            {
                name = title,
                currency = "PLN",
                quantity = "1",
                sku = "asd",
                price = Math.Round(cash, 2).ToString(CultureInfo.InvariantCulture),
            });

            var urls = new RedirectUrls()
            {
                cancel_url = cancelUri,
                return_url = redirectUri
            };

            var amount = new Amount()
            {
                currency = "PLN",
                total = Math.Round(cash, 2).ToString(CultureInfo.InvariantCulture)
            };

            var transactionPaypal = new List<Transaction>();
            transactionPaypal.Add(new Transaction()
            {
                description = title,
                invoice_number = Guid.NewGuid().ToString(),
                amount = amount,
                item_list = itemlist
            });

            var payment = new Payment()
            {
                payer = payer,
                redirect_urls = urls,
                intent = "sale",
                transactions = transactionPaypal
            };

            return payment.Create(apiContext);
        }

        /// <summary>
        ///     Create payment
        /// </summary>
        /// <param name="apiContext">api context</param>
        /// <param name="redirectUri">redirect uri</param>
        /// <param name="cancelUri">cancel uri</param>
        /// <returns></returns>
        public async Task<Payment> CreatePaymentForUser(APIContext apiContext, string redirectUri, string cancelUri, BookDto book, Domain.Enums.Currency currencyEnum)
        {

            var payee = new Payee()
            {
                email = book.Author.Email

            };

            var itemlist = new ItemList()
            {
                items = new List<Item>()
            };

            itemlist.items.Add(new Item()
            {
                name = book.Title,
                currency = currencyEnum.ToString(),
                quantity = "1",
                sku = "asd"
            });

            var currency = book.Prize;

            var urls = new RedirectUrls()
            {
                cancel_url = cancelUri,
                return_url = redirectUri
            };

            var amount = new Amount()
            {
                currency = currencyEnum.ToString(),
                total = Math.Round(currency ?? 0, 2).ToString(CultureInfo.InvariantCulture)
            };

            var transactionPaypal = new List<Transaction>();
            transactionPaypal.Add(new Transaction()
            {
                description = $"Sprzedaż książki {book.Title}",
                invoice_number = Guid.NewGuid().ToString(),
                amount = amount,
                item_list = itemlist
            });

            var payment = new Payment()
            {
                payee = payee,
                redirect_urls = urls,
                intent = "sale",
                transactions = transactionPaypal
            };

            return payment.Create(apiContext);
        }

        /// <summary>
        ///     Create payment
        /// </summary>
        /// <param name="apiContext">api context</param>
        /// <param name="redirectUri">redirect uri</param>
        /// <param name="cancelUri">cancel uri</param>
        /// <returns></returns>
        public async Task<Payment> CreatePaymentForUser(APIContext apiContext, string redirectUri, string cancelUri, string payeeUser, decimal cash, string title, Domain.Enums.Currency currencyEnum)
        {

            var payee = new Payee()
            {
                email = payeeUser
            };

            var payer = new Payer()
            {
                payment_method = "paypal",
                payer_info = new PayerInfo()
                {
                    email = ConfigurationConst.Paypal.Email
                }

            };


            var itemlist = new ItemList()
            {
                items = new List<Item>()
            };

            itemlist.items.Add(new Item()
            {
                name = title,
                currency = currencyEnum.ToString(),
                quantity = "1",
                sku = "asd",
                price = cash.ToString()
            });

            var urls = new RedirectUrls()
            {
                cancel_url = cancelUri,
                return_url = redirectUri
            };

            var amount = new Amount()
            {
                currency = currencyEnum.ToString(),
                total = Math.Round(cash, 2).ToString(CultureInfo.InvariantCulture)
            };

            var transactionPaypal = new List<Transaction>();
            transactionPaypal.Add(new Transaction()
            {
                description = title,
                invoice_number = Guid.NewGuid().ToString(),
                amount = amount,
                item_list = itemlist
            });

            var payment = new Payment()
            {
                payee = payee,
                payer = payer,
                redirect_urls = urls,
                intent = "sale",
                transactions = transactionPaypal
            };

            var str = payment.ConvertToJson();

            return payment.Create(apiContext);
        }
    }
}
