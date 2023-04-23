namespace Infrastructure.Services.Interfaces
{
    public interface ISmtpService
    {
        void SendEmail(string content, string sendEmail, string? subject = "Ebookworld");
    }
}
