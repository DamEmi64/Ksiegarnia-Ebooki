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
    private api: string = "https://localhost:7270/Review";

    create(request: CreateEditReview){
        return axios.post(this.api, request)
    }

    update(userId: string, request: CreateEditReview){
        return axios.post(`${this.api}/${userId}`, request)
    }

    delete(reviewId: string){
        return axios.delete(`${this.api}/${reviewId}`)
    }
}

export default new ReviewService();