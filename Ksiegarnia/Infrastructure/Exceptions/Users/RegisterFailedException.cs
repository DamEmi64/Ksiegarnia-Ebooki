namespace Infrastructure.Exceptions
{
    public class RegisterFailedException : DefaultException
    {
        public RegisterFailedException()
        {
            base.Title = "Register failed";
            base.StatusCode = System.Net.HttpStatusCode.BadRequest;
        }
    }
}
