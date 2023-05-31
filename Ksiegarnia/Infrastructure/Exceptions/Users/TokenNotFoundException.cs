namespace Infrastructure.Exceptions
{
    public class TokenNotFoundException : ExceptionBase
    {
        public TokenNotFoundException()
        {
            base.Title = "Token not found or it is incorrect";
            base.StatusCode = System.Net.HttpStatusCode.NotFound;
            ErrorCode = ErrorCode.TokenNotFound;
        }
    }
}
