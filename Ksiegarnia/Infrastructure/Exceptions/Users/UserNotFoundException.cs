namespace Infrastructure.Exceptions.Users
{
    public class UserNotFoundException : DefaultException
    {
        public UserNotFoundException(string id)
        {
            base.StatusCode = System.Net.HttpStatusCode.NotFound;
            base.Title = $"Nie znaleziono użytkownika {id}";
        }
    }
}
