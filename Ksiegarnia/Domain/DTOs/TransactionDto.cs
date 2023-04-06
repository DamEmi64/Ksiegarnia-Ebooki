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
        public UserDto Buyer { get; set; }

        /// <summary>
        ///     Transaction Book
        /// </summary>
        public BookDto Book { get; set; }
    }

    public static class TransactionConvert
    {
        public static TransactionDto ToDTO(this Transaction transaction)
        {
            return new TransactionDto()
            {
                Book = transaction.EBookReader?.EBook?.ToDTO() ?? throw new Exception("Book not found."),
                Buyer = transaction.EBookReader.User.ToDTO(),
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
    }

}
