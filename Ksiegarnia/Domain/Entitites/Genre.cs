namespace Domain.Entitites
{
    public class Genre
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<EBook> Books { get; set; }
    }
}
