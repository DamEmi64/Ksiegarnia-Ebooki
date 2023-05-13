namespace Infrastructure.Exceptions
{
    public class BookNotVerifiedException : ExceptionBase
    {
        public BookNotVerifiedException()
            : base()
        {
            base.Title = "Ebook not veirfied.";
            base.StatusCode = System.Net.HttpStatusCode.NotAcceptable;
        }
    }
}
