namespace Infrastructure.Exceptions
{
    /// <summary>
    ///     When change password failed
    /// </summary>
    public class UserNotDeletedException : ExceptionBase
    {
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="reasons">reason why failed</param>
        public UserNotDeletedException(IEnumerable<string> reasons)
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