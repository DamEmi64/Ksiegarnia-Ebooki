using Domain.Entitites;
using Domain.Enums;

namespace Domain.DTOs
{
    public class TransactionDto
    {
        /// <summary>
        ///     Transaction Id
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        ///     Transaction Date
        /// </summary>
        public DateTime Date { get; set; }

        /// <summary>
        ///     Transaction Currency
        /// </summary>
        public Currency Currency { get; set; }

        /// <summary>
        ///     Transaction Buyer (simplified)
        /// </summary>
        public UserDto? Buyer { get; set; }

        /// <summary>
        ///     Premium info
        /// </summary>
        public PremiumInfoDto? Premium { get; set; }
        /// <summary>
        ///     Transaction Book
        /// </summary>
        public IEnumerable<BookDto> Books { get; set; }
    }

    public static class TransactionConvert
    {
        public static TransactionDto? ToDTO(this Transaction transaction)
        {

            if (transaction != null)
            {
                return new TransactionDto()
                {
                    Books = transaction.EBookReaders?.GetBooks() ?? Array.Empty<BookDto>(),
                    Buyer = transaction.EBookReaders?.FirstOrDefault()?.User.ToDTO() ?? null,
                    Currency = transaction.Currency,
                    Premium = transaction.Premium.ToDTO(),
                    Date = transaction.DateTime,
                    Id = transaction.Id
                };
            }

            return null;
        }

        public static IEnumerable<TransactionDto> ToDTOs(this IEnumerable<Transaction> transactions)
        {
            foreach (var transaction in transactions)
            {
                yield return transaction.ToDTO();
            }
        }

        private static IEnumerable<BookDto> GetBooks(this IEnumerable<EBookReader> readers)
        {
            foreach (var reader in readers)
            {
                yield return reader.EBook.ToDTO();
            }
        }
    }

}
