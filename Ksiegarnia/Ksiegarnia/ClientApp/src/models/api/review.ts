import UserDTO from "./userDTO";

export interface Review {
    id: string,
    date: string,
    reviewer: UserDTO,
    opinion: string,
    grade: number
}