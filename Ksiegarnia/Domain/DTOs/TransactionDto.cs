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
        public DateTime DateTime { get; set; }

        /// <summary>
        ///     Transaction Currency
        /// </summary>
        public Currency Currency { get; set; }

        /// <summary>
        ///     Transaction Buyer (simplified)
        /// </summary>
        public UserDto? Buyer { get; set; }

        /// <summary>
        ///     Transaction Book
        /// </summary>
        public IEnumerable<BookDto> Books { get; set; }
    }

    public static class TransactionConvert
    {
        public static TransactionDto ToDTO(this Transaction transaction)
        {

            return new TransactionDto()
            {
                Books = transaction.EBookReaders?.GetBooks() ?? Array.Empty<BookDto>(),
                Buyer = transaction.EBookReaders?.FirstOrDefault()?.User.ToDTO() ?? null,
                Currency = transaction.Currency,
                DateTime = transaction.DateTime,
                Id = transaction.Id
            };
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
