using Domain.DTOs;
using Domain.Entitites;
using Domain.Enums;
using Domain.Repositories;
using Infrastructure.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Application.Controllers
{
    /// <summary>
    ///     Debug Controller  only for programmers and testing
    /// </summary>
    [Route("Test")]
    [ApiController]
    public class DebugController : Controller
    {
        private readonly IGenreRepository _genreRepository;
        private readonly IUserRepository _userRepository;
        private readonly IEBookRepository _bookRepository;
        private readonly IEBookReaderRepository _eBookReaderRepository;


        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="bookRepository"></param>
        /// <param name="genreRepository"></param>
        /// <param name="userRepository"></param>
        public DebugController(IEBookRepository bookRepository,
            IGenreRepository genreRepository,
            IUserRepository userRepository,
            IEBookReaderRepository eBookReaderRepository)
        {
            _bookRepository = bookRepository;
            _genreRepository = genreRepository;
            _userRepository = userRepository;
            _eBookReaderRepository = eBookReaderRepository;
        }

#if DEBUG

        /// <summary>
        ///     Create example data
        /// </summary>
        /// <param name="data">Data</param>
        /// <returns></returns>
        [HttpPost("examples")]
        public async Task<HttpStatusCode> Examples([FromBody] ExampleCreateDto data)
        {
            if (ModelState.IsValid)
            {
                SendTokenDto userData  = new();
                var token = await RegisterAdmin(data.AdminEmail, data.AdminPassword);

                if (!string.IsNullOrEmpty(data.PremiumEmail) && !string.IsNullOrEmpty(data.PremiumPassword))
                {
                    userData = await RegisterPremium(data.PremiumEmail, data.PremiumPassword);

                }

                if (!string.IsNullOrEmpty(data.Email) && !string.IsNullOrEmpty(data.Password))
                {
                    _ = await RegisterAdmin(data.Email, data.Password);

                }

                await GenerateGenres();

                await GenerateBooks(token, data.BookNo);

                if (!string.IsNullOrEmpty(data.PremiumEmail) && !string.IsNullOrEmpty(data.PremiumPassword))
                {
                    var books = await _bookRepository.GetEBooks();
                    await _eBookReaderRepository.Add(new Transaction()
                    {
                        BuyerId = userData.Id,
                        Currency = Currency.PLN,
                        DateTime = DateTime.Now,
                        Finished = true,
                        EBookReaders = new List<EBookReader>() {
                            new EBookReader() {
                            User = await _userRepository.Get(userData.Id),
                            EBook = books.First() } 
                        }
                    });

                    await _eBookReaderRepository.SaveChanges();
                }

                return HttpStatusCode.OK;
            }
            return HttpStatusCode.BadRequest;
        }

        /// <summary>
        ///     Return urls
        /// </summary>
        /// <param name="data">Data</param>
        /// <returns></returns>
        [HttpPost("url")]
        public string CheckUrl()
        {
            return Url.Action("example");
        }

        private async Task<SendTokenDto> RegisterAdmin(string email, string password)
        {
            var registerData = new RegisterDto()
            {
                Email = email,
                Password = password,
                FirstName = "Debug",
                LastName = "Debug",
                Nick = "Debug Account",
                PhoneNumber = "123456789"
            };

            var sendToken = await _userRepository.Register(registerData, password);

            await _userRepository.AddRole(sendToken.Id, Roles.Admin);

            return sendToken;

        }

        private async Task<SendTokenDto> RegisterPremium(string email, string password)
        {
            var registerData = new RegisterDto()
            {
                Email = email,
                Password = password,
                FirstName = "Debug",
                LastName = "Debug",
                Nick = "Debug Account",
                PhoneNumber = "123456789"
            };

            var sendToken = await _userRepository.Register(registerData, password);

            await _userRepository.AddRole(sendToken.Id, Roles.PremiumUser);

            return sendToken;

        }

        private async Task<SendTokenDto> RegisterUser(string email, string password)
        {
            var registerData = new RegisterDto()
            {
                Email = email,
                Password = password,
                FirstName = "Debug",
                LastName = "Debug",
                Nick = "Debug Account",
                PhoneNumber = "123456789"
            };

            var sendToken = await _userRepository.Register(registerData, password);

            await _userRepository.AddRole(sendToken.Id, Roles.User);

            return sendToken;

        }

        private async Task GenerateBooks(SendTokenDto sendToken, int bookNo)
        {
            var author = await _userRepository.Get(sendToken.Id);

            var genres = (await _genreRepository.GetAll()).ToList();

            var files = Directory.GetFiles("../../Examples/");

            var pictures = files.Where(x => x.EndsWith(".jpg") || x.EndsWith(".png")).ToList();
            var contents = files.Where(x => x.EndsWith(".pdf")).ToList();

            var random = new Random();

            EBook book;

            for (int i = 0; i < bookNo; i++)
            {
                book = new EBook()
                {
                    Author = author,
                    Verified = true,
                    Content = System.IO.File.ReadAllBytes(contents[random.Next(contents.Count())]),
                    Picture = System.IO.File.ReadAllBytes(pictures[random.Next(pictures.Count())]),
                    Title = $"Example {i}",
                    Description = "example Description",
                    Genre = genres[random.Next(genres.Count())],
                    Prize = Decimal.Parse((random.NextDouble() * 10.5).ToString())
                };

                await _bookRepository.Add(book);
            }

            await _bookRepository.SaveChanges();
        }

        private async Task GenerateGenres()
        {
            var list = new List<Genre>();
            list.Add(new Genre()
            {
                Name = "Thriller",
                Description = "Gatunek  mający wywołać u czytelnika bądź widza dreszcz emocji. Wykorzystuje on napięcie, niepewność i tajemniczość jako główne elementy utworu."
            });
            list.Add(new Genre()
            {
                Name = "Science-fiction",
                Description = "Gatunek  o fabule osnutej na przewidywanych osiągnięciach nauki i techniki oraz ukazującej ich wpływ na życie jednostki lub społeczeństwa."
            });
            list.Add(new Genre()
            {
                Name = "Powieść obyczajowa",
                Description = "Gatunek przedstawia typowe zachowania i postawy dla danej epoki"
            });

            foreach (var genre in list)
            {
                await _genreRepository.Add(genre);
            }

            await _genreRepository.SaveChanges();
        }

#endif
    }
}
