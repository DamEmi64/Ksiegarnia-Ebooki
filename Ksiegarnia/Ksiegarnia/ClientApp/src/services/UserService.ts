import axios from "axios"

export interface RegisterRequest{
    firstName?: string,
    lastName?: string,
    email: string,
    phoneNumber?: string,
    password: string,
    nick: string
}

export interface Credentials{
    email: string,
    password: string
}

class UserService {

    private api: string = "https://localhost:7270/Users"

    register(request: RegisterRequest){
        return axios.post(`${this.api}/Register`, request)
    }

    login(credentials: Credentials){
        return axios.post(`${this.api}/Login`, credentials)
    }
}

export default new UserService()