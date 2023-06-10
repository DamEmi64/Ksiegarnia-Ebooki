import Ebook from "./ebook";

export default interface Transaction {
    id: string,
    date: string,
    books: Ebook[],
    prize?: number,
    type: string
}