namespace Infrastructure.Exceptions.Books
{
    public class BookHasThisContentException : DefaultException
    {
        public BookHasThisContentException(string id)
        {
            base.StatusCode = System.Net.HttpStatusCode.Conflict;
            base.Title = "Istnieje książka o podanej treści";
            base.Description = $"Książka {id} zawiera podaną treść.";
        }
    }
}
