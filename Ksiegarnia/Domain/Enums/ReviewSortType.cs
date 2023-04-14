using Newtonsoft.Json;

namespace Domain.Enums
{
    public enum ReviewSortType
    {
        /// <summary>
        /// Descending by date
        /// </summary>
        [JsonProperty("DescByDate")]
        DescByDate,
        /// <summary>
        /// Descending by author nick
        /// </summary>
        [JsonProperty("DescByAuthor")]
        DescByAuthor,
        /// <summary>
        /// Ascending by date
        /// </summary>
        [JsonProperty("AscByDate")]
        AscByDate,
        /// <summary>
        /// Ascending by author
        /// </summary>
        [JsonProperty("AscByAuthor")]
        AscByAuthor,
        /// <summary>
        /// Ascending by author
        /// </summary>
        [JsonProperty("AscByStars")]
        AscByStars,
        /// <summary>
        /// Ascending by author
        /// </summary>
        [JsonProperty("DescByStars")]
        DescByStars,
    }
}
