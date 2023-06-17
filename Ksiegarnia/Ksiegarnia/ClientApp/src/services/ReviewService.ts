import axios from "axios";
import Ebook from "../models/api/ebook";
import UserDTO from "../models/api/userDTO";

export interface CreateEditReview {
    date: string,
    book: Ebook,
    reviewer: UserDTO,
    opinion: string,
    grade: number
}


class ReviewService {
    private api = `${process.env.REACT_APP_API}/Review`;

    getEbookReviews(ebookId: string, page: number, pageSize: number){
        return axios.get(`${this.api}/search`, {
            params: {
                bookId: ebookId,
                page: page,
                pageSize: pageSize,
                sort: "DescByDate"
            }
        })
    }

    create(request: CreateEditReview){
        return axios.post(this.api, request)
    }

    update(reviewId: string, request: CreateEditReview){
        return axios.put(`${this.api}/${reviewId}`, request)
    }

    delete(reviewId: string){
        return axios.delete(`${this.api}/${reviewId}`)
    }
}

export default new ReviewService();