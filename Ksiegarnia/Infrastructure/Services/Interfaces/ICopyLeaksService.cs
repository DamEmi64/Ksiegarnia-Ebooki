using Copyleaks.SDK.V3.API.Models.Callbacks;
using Domain.DTOs;
using Infrastructure.Services.PlagiatSystem;

namespace Infrastructure.Services.Interfaces
{
    public interface ICopyLeaksService
    {
        Task Submit(PlagiarismDto plagiatData);
        CopyLeaksResultResponse GetResult(string scanId);
        void SaveResults(CompletedCallback completedCallback, string scanId);
    }
}
