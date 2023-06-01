import { Distinction } from "./distinction";
import Genre from "./genre";
import { Promotion } from "./promotion";
import UserDTO from "./userDTO";

export default interface Ebook{
    id: string,
    title: string,
    genre: Genre,
    description: string,
    pageNumber: number,
    author: UserDTO,
    picture: string,
    prize: number,
    promotion?: Promotion,
    distinction?: Distinction
}