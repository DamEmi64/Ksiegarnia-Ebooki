namespace Infrastructure.Exceptions
{
    /// <summary>
    ///     When change password failed
    /// </summary>
    public class ChangeEmailFailedException : ExceptionBase
    {
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="reasons">reason why failed</param>
        public ChangeEmailFailedException(IEnumerable<string> reasons)
        {
            StatusCode = System.Net.HttpStatusCode.NotFound;
            Title = "Change password failed.";
            ErrorCode = ErrorCode.ChangeEmailFailed;

            var desc = "";

            foreach (var reason in reasons)
            {
                desc += reason + "\n";
            }
            Description = desc;
        }
    }
}