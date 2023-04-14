namespace Domain.Entitites
{
    public class EBookReader
    {
        public Guid Id { get; set; }

        public User User { get; set; }

        public Guid BookId { get; set; }
        public EBook? EBook { get; set; }

        public Guid TransactionId { get; set; }
        public Transaction Transaction { get; set; }

        public  List<Review> Reviews { get; set; }
    }
}
