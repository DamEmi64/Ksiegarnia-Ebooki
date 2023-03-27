using Infrastructure.Exceptions;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers
{
    [Route("test")]
    [ApiController]
    public class TestController : Controller
    {
        /// <summary>
        ///     DEBUG : TESTOWE ENDPOINTY
        /// </summary>
        /// <returns></returns>
        /// <exception cref="DefaultException"></exception>
        [HttpGet("exception")]
        public IActionResult Index()
        {
            throw new DefaultException(System.Net.HttpStatusCode.NotFound, "TEST", "DESC");
        }
    }
}
