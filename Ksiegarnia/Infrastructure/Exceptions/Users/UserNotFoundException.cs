namespace Infrastructure.Exceptions
{
    public class UserNotFoundException : ExceptionBase
    {
        public UserNotFoundException(string id)
        {
            base.StatusCode = System.Net.HttpStatusCode.NotFound;
            base.Title = $"Nie znaleziono użytkownika {id}";
            ErrorCode = ErrorCode.UserNotFound;
        }
    }
}
