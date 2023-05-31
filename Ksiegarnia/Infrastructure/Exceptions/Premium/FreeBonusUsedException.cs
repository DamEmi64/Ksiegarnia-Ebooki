namespace Infrastructure.Exceptions
{
    /// <summary>
    ///    Free bonus used exception
    /// </summary>
    public class FreeBonusUsedException : ExceptionBase
    {
        /// <summary>
        ///     Constructor
        /// </summary>
        public FreeBonusUsedException()
        {
            StatusCode = System.Net.HttpStatusCode.Conflict;
            Title = "Free options used. For more options buy premium";
            ErrorCode = ErrorCode.FreeBonusUsed;
        }
    }
}
