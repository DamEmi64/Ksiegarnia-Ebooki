using System.Net;

namespace Infrastructure.Exceptions.Books
{
    public class BookNotFoundException : DefaultException
    {
        public BookNotFoundException(string bookId)
        {
            base.Title = $"Nie znaleziono ksiązki {bookId}";
            base.StatusCode = HttpStatusCode.NotFound;
        }
    }
}
