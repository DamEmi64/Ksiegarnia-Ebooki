import Ebook from "./ebook";
import PagedResponse from "./pagedResponse";

export default interface Statistics{
    earned_cash: number,
    buyed_books: PagedResponse,
    selled_book: PagedResponse
}