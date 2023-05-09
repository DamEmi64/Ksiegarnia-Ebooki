using Domain.Enums;

namespace Domain.Entitites
{
    public class EBook
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public byte[] Picture { get; set; }
        public decimal Prize { get; set; }
        public byte[] Content { get; set; }
        public string Description { get; set; }
        public int PageNumber { get; set; }
        public List<EBookReader> Readers { get; set; } = new List<EBookReader>();
        public Genre Genre { get; set; }
        public User Author { get; set; }
        public Promotion? Promotion { get; set; }
        public string Tokens { get; set; }
        public Distinction? Distinction { get; set; }
        public DateTime Date { get; set; }
        public VerificationType Verification { get; set; }
    }
}
