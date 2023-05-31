using System.Net;

namespace Infrastructure.Exceptions
{
    public class ExceptionBase : Exception
    {
        public ExceptionBase()
        {

        }
        public ExceptionBase(HttpStatusCode statusCode, string title, string description = "")
        {
            StatusCode = statusCode;
            Title = title;
            Description = description;
        }
        public HttpStatusCode StatusCode { get; set; }

        public ErrorCode ErrorCode { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }
}
