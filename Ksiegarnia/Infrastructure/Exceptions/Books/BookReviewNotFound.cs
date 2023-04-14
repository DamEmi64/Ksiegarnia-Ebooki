namespace Infrastructure.Exceptions
{
    /// <summary>
    ///     Review not found exception
    /// </summary>
    public class BookReviewNotFound : DefaultException
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
