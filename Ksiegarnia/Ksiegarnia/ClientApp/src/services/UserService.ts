import axios from "axios"

export interface RegisterProps{
    firstName?: string,
    lastName?: string,
    email: string,
    phoneNumber?: string,
    password: string,
    nick: string
}

export interface UpdateRequest{
    firstName?: string,
    lastName?: string,
    email?: string,
    phoneNumber?: string,
    password?: string,
    nick?: string
}

export interface Credentials{
    email: string,
    password: string
}

class UserService {

    private api: string = "https://localhost:7270/Users"

    register(request: RegisterProps){
        return axios.post(`${this.api}/Register`, request)
    }

    login(credentials: Credentials){
        return axios.post(`${this.api}/Login`, credentials)
    }

    update(userId: string, request: UpdateRequest){
        return axios.put(`${this.api}/${userId}`, request)
    }
}

export default new UserService()