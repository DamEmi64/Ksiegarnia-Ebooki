namespace Infrastructure.Exceptions
{
    public class RegisterFailedException : ExceptionBase
    {
        public RegisterFailedException()
        {
            base.Title = "Register failed";
            base.StatusCode = System.Net.HttpStatusCode.BadRequest;
        }
    }
}
