namespace Domain.Entitites
{
    public class Premium
    {
        public Guid Id { get; set; }

        public DateTime StartDate { get; set; } = DateTime.Now;

        public DateTime EndDate { get; set; } = DateTime.MinValue;
    }
}
