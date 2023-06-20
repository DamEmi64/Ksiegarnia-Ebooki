
using Domain.Enums;

namespace Domain.DTOs
{
    public class SendCashDto
    {
        /// <summary>
        ///     Who pays
        /// </summary>
        public string UserId { get; set; }

        /// <summary>
        ///     How many
        /// </summary>
        public decimal Cash { get; set; }

        /// <summary>
        ///     Currency
        /// </summary>
        public Currency Currency { get; set; }
    }
}
