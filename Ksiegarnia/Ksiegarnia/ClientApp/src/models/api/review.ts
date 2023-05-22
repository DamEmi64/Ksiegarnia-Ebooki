import UserDTO from "./userDTO";

export interface Review {
    date: string,
    reviewer: UserDTO,
    grade: number
}