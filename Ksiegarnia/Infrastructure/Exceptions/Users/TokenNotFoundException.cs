namespace Infrastructure.Exceptions
{
    public class TokenNotFoundException : ExceptionBase
    {
        public TokenNotFoundException()
        {
            base.Title = "Token not found";
            base.StatusCode = System.Net.HttpStatusCode.NotFound;
        }
    }
}
