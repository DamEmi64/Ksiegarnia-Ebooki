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


        /// <summary>
        ///     Konstruktor
        /// </summary>
        /// <param name="bookRepository"></param>
        /// <param name="genreRepository"></param>
        /// <param name="userRepository"></param>
        public DebugController(IEBookRepository bookRepository, IGenreRepository genreRepository, IUserRepository userRepository)
        {
            _bookRepository = bookRepository;
            _genreRepository = genreRepository;
            _userRepository = userRepository;
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
                if (data.Token != Guid.Parse("e03745c4-6569-41f9-844e-a93fe5ca582d"))
                {
                    throw new DefaultException(HttpStatusCode.Forbidden, "Wrong access token");
                }

                var token = await RegisterAdmin(data.Email, data.Password);

                await GenerateGenres();

                await GenerateBooks(token);

                return HttpStatusCode.OK;
            }
            return HttpStatusCode.BadRequest;
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

        private async Task GenerateBooks(SendTokenDto sendToken)
        {
            var author = await _userRepository.Get(sendToken.Id);

            var genres = (await _genreRepository.GetAll()).ToList();

            var book = new EBook()
            {
                Author = author,
                Verified = true,
                Content = System.IO.File.ReadAllBytes("../../Przyklady/lalka.pdf"),
                Picture = System.IO.File.ReadAllBytes("../../Przyklady/lalka.jpg"),
                Title = "Lalka",
                Description = "EXAMPLE BOOK",
                Genre = genres.First(x => x.Name == "Powieść obyczajowa")
            };

            await _bookRepository.Add(book);

            book = new EBook()
            {
                Author = author,
                Verified = true,
                Content = System.IO.File.ReadAllBytes("../../Przyklady/lorem-ipsum.pdf"),
                Picture = System.IO.File.ReadAllBytes("../../Przyklady/lorem-ipsum.png"),
                Title = "Lorum ipsum",
                Description = "EXAMPLE BOOK",
                Genre = genres.First(x => x.Name == "Science-fiction")
            };

            await _bookRepository.Add(book);

            book = new EBook()
            {
                Author = author,
                Verified = false,
                Content = System.IO.File.ReadAllBytes("../../Przyklady/pies-baskervilleow.pdf"),
                Picture = System.IO.File.ReadAllBytes("../../Przyklady/pies.jpg"),
                Title = "Pies baskervilleów",
                Description = "EXAMPLE BOOK",
                Genre = genres.First(x => x.Name == "Thriller")
            };

            await _bookRepository.Add(book);

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
