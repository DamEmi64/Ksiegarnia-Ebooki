namespace Infrastructure.Exceptions
{
    /// <summary>
    ///     There is not enough cash in wallet
    /// </summary>
    public class WalletIsNotEnoughException : ExceptionBase
    {
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="reasons">reason why failed</param>
        public WalletIsNotEnoughException()
        {
            StatusCode = System.Net.HttpStatusCode.NotFound;
            Title = "There is not enough cash in wallet.";
            ErrorCode = ErrorCode.NotEnoughCashInWallet;
        }
    }
}
