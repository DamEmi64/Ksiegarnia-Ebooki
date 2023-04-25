using Domain.Entitites;

namespace Domain.DTOs
{
    /// <summary>
    ///     Promotion dto
    /// </summary>
    public class PromotionDto
    {
        /// <summary>
        ///     Start date
        /// </summary>
        public DateTime? StartDate { get; set; }

        /// <summary>
        ///     Promotion Expired Date
        /// </summary>
        public DateTime? EndDate { get; set; }

        /// <summary>
        ///     Prize
        /// </summary>
        public decimal Prize { get; set; }

        /// <summary>
        ///     Premium prize
        /// </summary>
        public decimal PremiumPrize { get; set; }

        /// <summary>
        ///     Is Premium only
        /// </summary>
        public bool IsPremiumOnly { get; set; }

    }

    /// <summary>
    ///     Promotion dto - conversion
    /// </summary>
    public static class PromotionConvert
    {
        public static PromotionDto ToDto(this Promotion promotion)
        {
            return new()
            {
                StartDate = promotion.StartDate,
                EndDate = promotion.EndDate,
                Prize = promotion.Prize,
                PremiumPrize = promotion.PremiumPrize,
                IsPremiumOnly = promotion.OnlyForPremium
            };
        }
    }
}
