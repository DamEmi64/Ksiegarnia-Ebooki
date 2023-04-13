import axios from "axios"
import { EbookSortOptions } from "../models/ebookSortOptions"
import EbookSearchCriteria from "../models/ebookSearchCriteria"

class EbookService {

    private api: string = "https://localhost:7270/Books"

    search(ebookSearchCriteria?: EbookSearchCriteria, sort?: string, page?: number, pageSize?: number){
        return axios.get(`${this.api}/search`, {
            params: {
                ebookSearchCriteria,
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
}

export default new EbookService()