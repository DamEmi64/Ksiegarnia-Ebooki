import { EbookAcceptance } from "./api/ebookAcceptance";

export default interface EbookSearchCriteria {
    authorName?: string,
    phrase?: string,
    genre?: string[],
    minPrize?: number,
    maxPrize?: number,
    onlyOnPromotion?: boolean,
    verificationType?: EbookAcceptance,
    year?: number
}