namespace Infrastructure.Exceptions
{
    /// <summary>
    ///     Review not found exception
    /// </summary>
    public class BookReviewNotFoundException : ExceptionBase
    {
        /// <summary>
        ///     Constructor
        /// </summary>
        public BookReviewNotFoundException()
        {
            StatusCode = System.Net.HttpStatusCode.NotFound;
            Title = "Review not found";
            ErrorCode = ErrorCode.BookNotVerified;
        }
    }
}
