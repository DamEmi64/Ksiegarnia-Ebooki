using Domain.DTOs;

namespace Infrastructure.Services.Interfaces
{
    public interface IPaymentService
    {
        /// <summary>
        ///     get payment link
        /// </summary>
        /// <param name="cancelUri">uri to cancel</param>
        /// <param name="redirectUri">uri to redirect</param>
        /// <param name="transaction">transaction</param>
        /// <param name="commission">commission</param>
        /// <param name="isForUser">Is money send to user</param>
        /// <returns></returns>
        IEnumerable<string> GetUri(string cancelUri, string redirectUri, TransactionDto transaction, decimal commission, bool isForUser);

        /// <summary>
        ///     get payment link
        /// </summary>
        /// <param name="cancelUri">uri to cancel</param>
        /// <param name="redirectUri">uri to redirect</param>
        /// <param name="title"></param>
        /// <param name="cash"></param>
        /// <param name="isForUser">Is money send to user</param>
        /// <returns></returns>
        IEnumerable<string> GetUri(string cancelUri, string redirectUri, string title, decimal cash, string? payee = null);

        /// <summary>
        ///     Execute payment
        /// </summary>
        /// <param name="paymentId"></param>
        /// <param name="payerId"></param>
        /// <returns></returns>
        public bool Execute(string paymentId, string payerId);

    }
}
