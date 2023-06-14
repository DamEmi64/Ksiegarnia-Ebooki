using Domain.DTOs;
using Infrastructure.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using PayPal.Api;
using System.Globalization;

namespace Infrastructure.Services.Paypal
{
    /// <summary>
    ///     Paypal service
    /// </summary>
    public partial class PaypalService : IPaymentService
    {

        private readonly IHttpContextAccessor _httpContextAccessor;

        public PaypalService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
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

                        _httpContextAccessor.HttpContext.Session.SetString("payment", payment.id);

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
                    payment = CreatePayment(context, redirectUri, cancelUri, transaction, commission);

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

                _httpContextAccessor.HttpContext.Session.SetString("payment", payment.id);

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
        public bool Execute(string paymentId)
        {
            var context = GetAPIContext(GetAccessToken());

            var paymentExe = new PaymentExecution()
            {
                payer_id = _httpContextAccessor.HttpContext.Session.GetString("payment")
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
        public Payment CreatePayment(APIContext apiContext, string redirectUri, string cancelUri, TransactionDto transaction, decimal commission)
        {
            var payer = new Payer()
            {
                payment_method = "paypal"
            };

            var itemlist = new ItemList()
            {
                items = new List<Item>()
            };

            decimal currency = 0;

            foreach (var book in transaction.Books)
            {
                var prize = book.Prize * commission / 100 + book.Prize;
                currency += prize ?? 0;
                itemlist.items.Add(new Item()
                {
                    name = book.Title,
                    currency = transaction.Currency.ToString(),
                    quantity = "1",
                    sku = "asd",
                    price = Math.Round(prize ?? 0, 2).ToString(CultureInfo.InvariantCulture),
                });

            }

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

            var itemlist = new ItemList()
            {
                items = new List<Item>()
            };

            itemlist.items.Add(new Item()
            {
                name = title,
                currency = currencyEnum.ToString(),
                quantity = "1",
                sku = "asd"
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
                redirect_urls = urls,
                intent = "sale",
                transactions = transactionPaypal
            };

            return payment.Create(apiContext);
        }
    }
}
