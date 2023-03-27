using Copyleaks.SDK.V3.API.Models.Callbacks;
using Infrastructure.Services.Interfaces;
using Infrastructure.Services.PlagiatSystem;
using Microsoft.AspNetCore.Mvc;

namespace Application.Controllers
{
    [Route("Plagiarism")]
    [ApiController]
    public class PlagiarismController : Controller
    {
        private readonly ICopyLeaksService _copyLeaksService;


        public PlagiarismController(ICopyLeaksService copyLeaksService)
        {
            _copyLeaksService = copyLeaksService;
        }

        /// <summary>
        ///     Send content to plagiat system
        /// </summary>
        /// <param name="content">data</param>
        /// <returns></returns>

        [HttpPost]
        [Route("/submit")]
        public async Task<IActionResult> Submit(byte[] content)
        {
            await _copyLeaksService.Submit(content);
            
            return Ok();
        }
        /// <summary>
        ///     Receive plagiarism result
        /// </summary>
        /// <param name="scanId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("/{scanId}/checkResult")]
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
        [Route("/{scanId}/completed")]
        public IActionResult CompletedProcess(string scanId, [FromBody] CompletedCallback scanResults)
        {
            // Do something with the scan results
            _copyLeaksService.SaveResults(scanResults, scanId);
            return Ok();
        }
    }
}

