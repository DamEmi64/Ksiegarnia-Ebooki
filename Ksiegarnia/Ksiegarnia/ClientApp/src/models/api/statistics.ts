import Ebook from "./ebook";
import PagedResponse from "./pagedResponse";

export default interface Statistics{
    earned_cash: number,
    selled_book: PagedResponse
}