using Copyleaks.SDK.V3.API.Models.Callbacks;

namespace Infrastructure.Services.PlagiatSystem
{
    public class CopyLeaksResultResponse
    {
        public CompletedCallback CompletedCallback { get; set; }

        public string ScanId { get; set; }

    }
}
