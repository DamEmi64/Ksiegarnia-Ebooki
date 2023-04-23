namespace Domain.Entitites
{
    public class Distinction
    {
        public Guid Id { get; set; }
        public EBook Book { get; set; }
        public DateTime StartDate { get; set; }
        public Guid BookId { get; set; }
        public int HowLong { get; set; }
    }
}
