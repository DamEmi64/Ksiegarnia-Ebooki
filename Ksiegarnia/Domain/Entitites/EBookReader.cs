namespace Domain.Entitites
{
    public class EBookReader
    {
        public Guid Id { get; set; }

        public User User { get; set; }

        public EBook EBook { get; set; }
    }
}
