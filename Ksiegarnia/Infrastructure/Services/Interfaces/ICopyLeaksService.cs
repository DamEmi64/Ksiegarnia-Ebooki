using Copyleaks.SDK.V3.API.Models.Callbacks;
using Infrastructure.Services.PlagiatSystem;

namespace Infrastructure.Services.Interfaces
{
    public interface ICopyLeaksService
    {
        Task Submit(byte[] content);
        CopyLeaksResultResponse GetResult(string scanId);
        void SaveResults(CompletedCallback completedCallback, string scanId);
    }
}
