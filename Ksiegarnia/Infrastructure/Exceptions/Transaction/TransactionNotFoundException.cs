namespace Infrastructure.Exceptions
{
    public class TransactionNotFoundException : DefaultException
    {
        public TransactionNotFoundException()
        {
            base.Title = "Transaction not found";
            base.StatusCode = System.Net.HttpStatusCode.NotFound;
        }
    }
}
