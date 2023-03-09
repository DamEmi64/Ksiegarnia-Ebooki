using Domain.Enums;

namespace Domain.Entitites
{
    public class Transaction
    {
        public Guid Id { get; set; }

        public DateTime DateTime { get; set; }

        public Currency Currency { get; set; }

        public EBookReader EBookReader { get; set; }
    }
}
