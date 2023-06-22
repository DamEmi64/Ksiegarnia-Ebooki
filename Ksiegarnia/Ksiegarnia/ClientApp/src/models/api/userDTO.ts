import { Role } from "./role";

export default interface UserDTO {
    id: string,
    nick: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    age: number,
    roles: Role[],
    wallet?: number
}