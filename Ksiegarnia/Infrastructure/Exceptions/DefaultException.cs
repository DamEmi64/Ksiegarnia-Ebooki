using System.Net;

namespace Infrastructure.Exceptions
{
    public class DefaultException : Exception
    {
        public DefaultException(HttpStatusCode statusCode, string title, string description = "")
        {
            StatusCode = statusCode;
            Title = title;
            Description = description;
        }
        public HttpStatusCode StatusCode { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }
}
