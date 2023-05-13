namespace Infrastructure.Exceptions
{
    /// <summary>
    ///     Review not found exception
    /// </summary>
    public class BookReviewNotFound : ExceptionBase
    {
        /// <summary>
        ///     Constructor
        /// </summary>
        public BookReviewNotFound()
        {
            StatusCode = System.Net.HttpStatusCode.NotFound;
            Title = "Review not found";
        }
    }
}
