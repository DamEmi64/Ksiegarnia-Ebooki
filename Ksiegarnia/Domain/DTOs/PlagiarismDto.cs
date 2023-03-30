namespace Domain.DTOs
{
    public class PlagiarismDto
    {
        public Guid BookId { get; set; }

        public byte[] Content { get; set; }
    }
}
