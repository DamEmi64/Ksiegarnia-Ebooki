using Infrastructure.Services.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace Infrastructure.Services.Auth
{
    /// <summary>
    ///     Auth Service
    /// </summary>
    public class SmtpService : ISmtpService
    {
        /// <summary>
        ///     Send Mail
        /// </summary>
        /// <param name="content">Mail content</param>
        /// <param name="sendEmail">Sender email</param>
        /// <param name="subject">Mail title</param>
        public void SendEmail(string content, string sendEmail, string? subject = "Edytor Tekstowy")
        {
            var smtpData = ConfigurationConst.SMTP;
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(smtpData.Email));
            email.To.Add(MailboxAddress.Parse(sendEmail));
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = content };
            using var smtp = new SmtpClient();
            smtp.Connect(smtpData.SmtpServer, smtpData.SmtpPort, SecureSocketOptions.StartTls);
            smtp.Authenticate(smtpData.Email, smtpData.Password);
            smtp.Send(email);
            smtp.Disconnect(true);
        }

    }
}

