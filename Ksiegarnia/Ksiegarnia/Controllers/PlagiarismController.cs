using Copyleaks.SDK.V3.API.Models.Callbacks;
using Domain.DTOs;
using Domain.Repositories;
using Infrastructure;
using Infrastructure.Exceptions;
using Infrastructure.Services.Interfaces;
using Infrastructure.Services.PlagiatSystem;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers
{
    /// <summary>
    ///     Plagiat System Controller
    /// </summary>
    [Route("Plagiarism")]
    [ApiController]
    public class PlagiarismController : Controller
    {
        private readonly ICopyLeaksService _copyLeaksService;
        private readonly IEBookRepository _eBookRepository;
        private readonly ISmtpService _smtpService;

        /// <summary>
        ///     Controller
        /// </summary>
        /// <param name="copyLeaksService"></param>
        /// <param name="eBookRepository"></param>
        public PlagiarismController(ICopyLeaksService copyLeaksService, IEBookRepository eBookRepository, ISmtpService smtpService)
        {
            _copyLeaksService = copyLeaksService;
            _eBookRepository = eBookRepository;
            _smtpService = smtpService;
        }

        /// <summary>
        ///     Send content to plagiat system
        /// </summary>
        /// <param name="content">data</param>
        /// <returns></returns>

        [HttpPost]
        [Route("submit")]
        public async Task<IActionResult> Submit([FromBody] PlagiarismDto content)
        {
            var uriBuilder = new UriBuilder(Request.Scheme, Request.Host.Host, Request.Host.Port ?? -1);
            if (uriBuilder.Uri.IsDefaultPort)
            {
                uriBuilder.Port = -1;
            }

            ConfigurationConst.CopyLeak.WebHookHost = new Uri(uriBuilder.Uri.AbsoluteUri);
            await _copyLeaksService.Submit(content);

            return Ok();
        }
        /// <summary>
        ///     Receive plagiarism result
        /// </summary>
        /// <param name="scanId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{scanId}/checkResult")]
        public CopyLeaksResultResponse CheckResult(string scanId)
        {
            return _copyLeaksService.GetResult(scanId);
        }

        /// <summary>
        /// Receive the Completed callback from Copyleaks API with the result of the scan
        /// </summary>
        /// <param name="scanId">The unique scanID as provided in the 'submit' request</param>
        /// <param name="scanResults">The scan results</param>
        /// <returns></returns>
        [HttpPost]
        [Route("{scanId}/completed")]
        public async Task<IActionResult> CompletedProcess(string scanId, [FromBody] CompletedCallback scanResults)
        {
            // Do something with the scan results
            _copyLeaksService.SaveResults(scanResults, scanId);
            try
            {
                var book = await _eBookRepository.Get(new Guid(scanId));
                if (book != null)
                {
                    if (scanResults.Results.Score.AggregatedScore > 70)
                    {
                        book.Verification = Domain.Enums.VerificationType.Rejected;
                        await _eBookRepository.SaveChanges();

                        throw new ExceptionBase(System.Net.HttpStatusCode.Conflict,
                            "PLAGIAT",
                            $"Wykryto plagiat na poziome {scanResults.Results.Score.AggregatedScore}");
                    }
                    else
                    {
                        book.Verification = Domain.Enums.VerificationType.Accepted;
                        _smtpService.SendEmail($"Książka {book.Title} przeszła pozytywnie test antyplagiatowy i została dopuszczona do sprzedaży.", book.Author.Email);
                    }
                }
            }
            catch (Exception) { }

            return Ok();
        }
    }
}

