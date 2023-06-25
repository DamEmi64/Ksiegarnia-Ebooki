using Domain.DTOs;
using Domain.Repositories;
using Infrastructure;
using Microsoft.AspNetCore.Http;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests.Services
{
    public class PaypalService
    {
        [Fact]
        public async Task Paypal_generate_link()
        {
            var httpAncestor = new Mock<IHttpContextAccessor>();

            ConfigurationConst.Paypal = new()
            {
                ClientSecret = "EPzazY3wPnQuWfiPAW8DX1TV6ccIywxwbpVShdb9B6P2Ix9tQVRd-aAgSTg-LjdMQJgQRuM6fuOmG5cx",
                ClientId = "AaLPye5b_Gp3jCt-4FNp_eVepTqnDHLFwhjyFC9qX15zalKtEDMt6nsfeu5PFYE2Nr32gvJet2FeM7HL",
                Mode = "sandbox"
            };

            var transaction = new TransactionDto()
            {
                Books = new List<BookDto>()
                {
                    new()
                    {
                        Author = new()
                        {
                            FirstName = "Jan",
                            LastName = "Kowalski",
                            Nick = "Tester",
                            Email = "test@example.com"
                        },
                        Id = Guid.NewGuid(),
                        Prize = 10,
                        Title = "testowa"
                    },
                                        new()
                    {
                        Author = new()
                        {
                            FirstName = "Jan",
                            LastName = "Kowalski",
                            Nick = "Tester",
                            Email = "test@example.com"
                        },
                        Id = Guid.NewGuid(),
                        Prize = 10,
                        Title = "testowa 2"
                    }
                },
                Buyer = new()
                {
                    FirstName = "Tomasz",
                    LastName = "Kowalski",
                    Nick = "Tester",
                    Email = "test@example.com"
                },
                Id = Guid.NewGuid(),
            };

            var paypal = new Infrastructure.Services.Paypal.PaypalService(new Mock<IUserRepository>().Object);

            var result =  paypal.GetUri("https://localhost:7270/", "https://localhost:7270/", transaction, 10, false).ToList();

            Assert.NotNull(result);
        }
    }
}
