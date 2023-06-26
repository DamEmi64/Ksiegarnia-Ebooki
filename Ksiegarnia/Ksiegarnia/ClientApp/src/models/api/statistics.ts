import Ebook from "./ebook";
import PagedResponse from "./pagedResponse";
import Transaction from "./transaction";

export default interface Statistics{
    earned_cash: number,
    buyed_books: Transaction[],
    selled_book: Transaction[],
}