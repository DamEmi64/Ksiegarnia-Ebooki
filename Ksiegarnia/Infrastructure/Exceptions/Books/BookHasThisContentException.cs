namespace Infrastructure.Exceptions
{
    public class BookHasThisContentException : ExceptionBase
    {
        public BookHasThisContentException(string id)
        {
            StatusCode = System.Net.HttpStatusCode.Conflict;
            Title = "Istnieje książka o podanej treści";
            Description = $"Książka {id} zawiera podaną treść.";
            ErrorCode = ErrorCode.BookHasThisContent;
        }
    }
}
