namespace Infrastructure.Exceptions
{
    public class LoginFailedException : DefaultException
    {
        public LoginFailedException()
        {
            base.Title = "Login Failed";
            base.StatusCode = System.Net.HttpStatusCode.BadRequest;
        }
    }
}
