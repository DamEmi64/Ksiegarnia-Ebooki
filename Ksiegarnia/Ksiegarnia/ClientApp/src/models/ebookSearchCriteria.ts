import Genre from "./api/genre";
import { EbookSortOptions } from "./ebookSortOptions";

export default interface EbookSearchCriteria {
    authorName?: string,
    phrase?: string,
    genre?: string[],
    minPrize?: number,
    maxPrize?: number,
    onlyOnPromotion?: boolean,
    year?: number
}