import Ebook from "./ebook";

export default interface Transaction {
    id: string,
    dateTime: string,
    books: Ebook[],
    prize?: number
}