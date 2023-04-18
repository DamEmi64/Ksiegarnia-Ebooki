import axios from "axios"
import { EbookSortOptions } from "../models/ebookSortOptions"
import EbookSearchCriteria from "../models/ebookSearchCriteria"
import Ebook from "../models/api/ebook"
import Genre from "../models/api/genre"
import UserDTO from "../models/api/userDTO"

export interface CreateEbookProps{
    title: string,
    genre: Genre,
    description: string,
    pageNumber: number,
    author: UserDTO,
    picture: string,
    prize: number,
    content: string
}

class EbookService {

    private api: string = "https://localhost:7270/Books"

    search(ebookSearchCriteria?: EbookSearchCriteria, sort?: string, page?: number, pageSize?: number){
        return axios.get(`${this.api}/search`, {
            params: {
                ...ebookSearchCriteria,
                sort,
                page,
                pageSize
            }
        })
    }

    getBestsellers(page?: number, pageSize?: number){
        return axios.get(`${this.api}/bestseller`, {
            params: {
                page,
                pageSize
            }
        })
    }

    create(createEbookProps: CreateEbookProps){
        return axios.post(this.api, createEbookProps)
    }

    delete(ebookId: string){
        return axios.delete(`${this.api}/${ebookId}`)
    }
}

export default new EbookService()