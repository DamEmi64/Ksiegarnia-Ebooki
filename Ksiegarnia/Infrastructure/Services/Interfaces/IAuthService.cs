namespace Infrastructure.Services.Interfaces
{
    public interface IAuthService
    {
        void SendEmail(string content, string sendEmail, string? subject = "Księgarnia");
    }
}
