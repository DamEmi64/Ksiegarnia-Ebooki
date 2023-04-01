namespace Infrastructure.Exceptions
{
    public class TokenNotFoundException : DefaultException
    {
        public TokenNotFoundException()
        {
            base.Title = "Token not found";
            base.StatusCode = System.Net.HttpStatusCode.NotFound;
        }
    }
}
