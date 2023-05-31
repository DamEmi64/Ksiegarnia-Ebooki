using System.Net;

namespace Infrastructure.Exceptions
{
    public class BookNotFoundException : ExceptionBase
    {
        public BookNotFoundException(string bookId)
        {
            base.Title = $"Nie znaleziono ksiązki {bookId}";
            base.StatusCode = HttpStatusCode.NotFound;
            ErrorCode = ErrorCode.BookNotFound;
        }
    }
}
