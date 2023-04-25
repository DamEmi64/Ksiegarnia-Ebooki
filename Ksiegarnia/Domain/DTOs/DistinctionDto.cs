namespace Domain.DTOs
{
    public class DistinctionDto
    {
        /// <summary>
        ///     When user distinct
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        ///     For how long in days
        /// </summary>
        public int HowLong { get; set; }
    }
}
