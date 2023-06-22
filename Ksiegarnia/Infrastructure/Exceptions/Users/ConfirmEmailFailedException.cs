namespace Infrastructure.Exceptions
{
    /// <summary>
    ///     When change password failed
    /// </summary>
    public class ConfirmEmailFailedException : ExceptionBase
    {
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="reasons">reason why failed</param>
        public ConfirmEmailFailedException(IEnumerable<string> reasons)
        {
            StatusCode = System.Net.HttpStatusCode.NotFound;
            Title = "Confitm email failed.";
            ErrorCode = ErrorCode.ConfirmEmailFailed;

            var desc = "";

            foreach (var reason in reasons)
            {
                desc += reason + "\n";
            }
            Description = desc;
        }
    }
}