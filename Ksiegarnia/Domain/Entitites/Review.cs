namespace Domain.Entitites
{
    public class Review
    {
        public Guid Id { get; set; }

        public DateTime Date { get; set; }

        public EBookReader Reader { get; set; }

        public string Opinion { get; set; } = string.Empty;

        public decimal Grade { get; set; }
    }
}
