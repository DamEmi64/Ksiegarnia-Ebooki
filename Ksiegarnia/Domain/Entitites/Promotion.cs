namespace Domain.Entitites
{
    /// <summary>
    ///     Promotion
    /// </summary>
    public class Promotion
    {
        public Guid Id { get; set; }

        public EBook Book { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public decimal Prize { get; set; }

        public bool OnlyForPremium { get; set; }

        public decimal PremiumPrize { get; set; }

        public Guid BookId { get; set; }
    }
}
