import Genre from "./genre";
import UserDTO from "./userDTO";

export default interface Ebook{
    id: string,
    title: string,
    genre: Genre,
    description: string,
    pageNumber: number,
    content: string,
    author: UserDTO,
    picture: string,
    prize: number
}