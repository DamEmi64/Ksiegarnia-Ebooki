using Domain.Entitites;

namespace Domain.DTOs
{
    /// <summary>
    ///     Promotion dto
    /// </summary>
    public class PromotionDto
    {
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public decimal Prize { get; set; }

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
            };
        }
    }
}
