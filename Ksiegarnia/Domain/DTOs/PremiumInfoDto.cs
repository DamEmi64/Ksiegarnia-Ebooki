namespace Domain.DTOs
{
    public class PremiumInfoDto
    {
        /// <summary>
        ///     Is premium active
        /// </summary>
        public bool IsActive { get; set; }

        /// <summary>
        ///     Premium user id
        /// </summary>
        public string UserId { get;set; }

        /// <summary>
        ///     Date when premium was buyed
        /// </summary>
        public DateTime BuyDate { get; set; }

        /// <summary>
        ///     Date when premium is ended
        /// </summary>
        public DateTime EndDate { get; set; }
    }
}
