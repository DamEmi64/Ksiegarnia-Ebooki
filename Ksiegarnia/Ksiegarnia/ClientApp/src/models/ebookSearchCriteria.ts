export default interface EbookSearchCriteria {
    authorName?: string,
    phrase?: string,
    genre?: string[],
    minPrize?: number,
    maxPrize?: number,
    onlyOnPromotion?: boolean,
    onlyVerified?: boolean,
    year?: number
}