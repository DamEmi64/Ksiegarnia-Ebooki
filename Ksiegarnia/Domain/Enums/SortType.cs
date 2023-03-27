using Newtonsoft.Json;

namespace Domain.Enums
{
    public enum SortType
    {
        /// <summary>
        ///     Descending by name
        /// </summary>
        [JsonProperty("DescByName")]
        DescByName,
        /// <summary>
        /// Descending by genre
        /// </summary>
        [JsonProperty("DescByGenre")]
        DescByGenre,
        /// <summary>
        /// Descending by prize
        /// </summary>
        [JsonProperty("DescByPrize")]
        DescByPrize,
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
        /// Ascending by name
        /// </summary>
        [JsonProperty("AscByName")] 
        AscByName,
        /// <summary>
        /// Ascending by genre
        /// </summary>
        [JsonProperty("AscByGenre")] 
        AscByGenre,
        /// <summary>
        /// Ascending by prize
        /// </summary>
        [JsonProperty("AscByPrize")] 
        AscByPrize,
        /// <summary>
        /// Ascending by date
        /// </summary>
        [JsonProperty("AscByDate")] 
        AscByDate,
        /// <summary>
        /// Ascending by author
        /// </summary>
        [JsonProperty("AscByAuthor")] 
        AscByAuthor

    }
}
