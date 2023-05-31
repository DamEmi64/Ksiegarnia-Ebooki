namespace Infrastructure.Exceptions
{
    public class TransactionNotFoundException : ExceptionBase
    {
        public TransactionNotFoundException()
        {
            base.Title = "Transaction not found";
            base.StatusCode = System.Net.HttpStatusCode.NotFound;
            ErrorCode = ErrorCode.TransactionNotFound;
        }
    }
}
