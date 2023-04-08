using Infrastructure.Configuration;
using Infrastructure.Services.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace Infrastructure.Services.Auth
{
    public class AuthService : IAuthService
    {
        /// <summary>
        ///     Send Mail
        /// </summary>
        /// <param name="content">Mail content</param>
        /// <param name="sendEmail">Sender email</param>
        /// <param name="subject">Mail title</param>
        public void SendEmail(string content, string sendEmail, string? subject = "Edytor Tekstowy")
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(ConfigurationConst.Email));
            email.To.Add(MailboxAddress.Parse(sendEmail));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = content };
            using var smtp = new SmtpClient();
            smtp.Connect(ConfigurationConst.SmtpServer, ConfigurationConst.SmtpPort, SecureSocketOptions.StartTls);
            smtp.Authenticate(ConfigurationConst.Email, ConfigurationConst.EmailPassword);
            smtp.Send(email);
            smtp.Disconnect(true);
        }

    }
}

