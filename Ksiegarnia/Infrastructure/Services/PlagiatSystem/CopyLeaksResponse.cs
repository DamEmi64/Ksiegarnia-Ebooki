using Copyleaks.SDK.V3.API.Models.Responses.Result;

namespace Infrastructure.Services.PlagiatSystem
{
    public class CopyLeaksResponse : BaseResponse
    {
        public string ScanId { get; set; }

        public string Token { get; set; }
        public uint ClientCredits { get; set; }
    }
}
