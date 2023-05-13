namespace Infrastructure.Exceptions
{
    public class GenreNotFoundException : ExceptionBase
    {
        public GenreNotFoundException()
        {
            base.Title = "Genre not found";
            base.StatusCode = System.Net.HttpStatusCode.NotFound;
        }
    }
}
