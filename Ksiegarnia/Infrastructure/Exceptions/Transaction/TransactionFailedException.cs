using System.Text;

namespace Infrastructure.Exceptions
{
    public class TransactionFailedException : ExceptionBase
    {
        public TransactionFailedException()
        {
            base.Title = "Transaction failed. Contact with website owners.";
            base.StatusCode = System.Net.HttpStatusCode.NotFound;
        }

        public TransactionFailedException(List<string> errors)
        {
            var builder = new StringBuilder();

            foreach (var error in errors)
            {
                builder.AppendLine(error.ToString());
            }

            base.Title = $"Transaction failed. Contact with website owners. Errors: {builder}";
            base.StatusCode = System.Net.HttpStatusCode.NotFound;
            ErrorCode = ErrorCode.TransactionFailed;
        }
    }
}
