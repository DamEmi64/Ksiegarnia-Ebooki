namespace Infrastructure.Exceptions
{
    /// <summary>
    ///     When change password failed
    /// </summary>
    public class ChangePasswordFailedException : ExceptionBase
    {
        /// <summary>
        ///     Constructor
        /// </summary>
        /// <param name="reasons">reason why failed</param>
        public ChangePasswordFailedException(IEnumerable<string> reasons)
        {
            StatusCode = System.Net.HttpStatusCode.NotFound;
            Title = "Change password failed.";

            var desc = "";

            foreach (var reason in reasons)
            {
                desc += reason + "\n";
            }
            Description = desc;
        }
    }
}
