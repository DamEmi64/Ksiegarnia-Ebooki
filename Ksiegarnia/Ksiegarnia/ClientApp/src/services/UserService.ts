import axios from "axios"
import HideInfo from "../models/api/hideInfo"

export interface RegisterProps{
    firstName?: string,
    lastName?: string,
    email: string,
    birthDate: string,
    phoneNumber?: string,
    password: string,
    nick: string,
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
        const hideInfo: HideInfo = {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            age: true
        }

        return axios.post(`${this.api}/Register`, {
            ...request, 
            hideInfo: hideInfo,
        })
    }

    login(credentials: Credentials){
        return axios.post(`${this.api}/Login`, credentials)
    }

    logout(){
        return axios.post(`${this.api}/logout`)
    }

    update(userId: string, request: UpdateRequest){
        return axios.put(`${this.api}/${userId}`, request)
    }

    getOwnedEbooks(userId: string, authorId: string, page?: number, pageSize?: number){
        return axios.get(`${this.api}/${userId}/ebooks`, {
            params: {
                author: authorId,
                page,
                pageSize
            }
        })
    }

    getPublishedEbooks(userId: string, authorId: string, page?: number, pageSize?: number){
        return axios.get(`${this.api}/${userId}/publications`, {
            params: {
                author: authorId,
                page,
                pageSize
            }
        })
    }
}

export default new UserService()