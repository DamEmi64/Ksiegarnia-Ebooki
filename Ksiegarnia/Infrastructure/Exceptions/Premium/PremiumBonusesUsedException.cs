namespace Infrastructure.Exceptions
{
    /// <summary>
    ///     Premium bonueses used
    /// </summary>
    public class PremiumBonusUsedException : ExceptionBase
    {
        /// <summary>
        ///     Constructor
        /// </summary>
        public PremiumBonusUsedException()
        {
            StatusCode = System.Net.HttpStatusCode.Conflict;
            Title = "Used premium bonuses";
            ErrorCode = ErrorCode.PremiumBonusesUsed;
        }
    }
}

