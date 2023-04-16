import Genre from "./api/genre";
import { EbookSortOptions } from "./ebookSortOptions";

export default interface EbookSearchCriteria {
    authorName?: string,
    phrase?: string,
    genre1?: Genre,
    genre2?: Genre,
    genre3?: Genre,
    minPrize?: number,
    maxPrize?: number,
    onlyOnPromotion?: boolean,
    year?: number
}