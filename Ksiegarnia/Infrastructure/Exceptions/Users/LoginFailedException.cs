namespace Infrastructure.Exceptions
{
    public class LoginFailedException : ExceptionBase
    {
        public LoginFailedException()
        {
            base.Title = "Login Failed";
            base.StatusCode = System.Net.HttpStatusCode.BadRequest;
            ErrorCode = ErrorCode.LoginFailed;
        }
    }
}
