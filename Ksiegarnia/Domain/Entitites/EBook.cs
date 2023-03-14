namespace Domain.Entitites
{
    public class EBook
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public byte[] Content { get; set; }

        public string Description { get; set; }

        public int PageNumber { get; set; }

        public List<EBookReader>? Readers { get; set; }

        public Genre Genre { get; set; }

        public User Author { get; set; }
    }
}
