import axios from "axios";
import Ebook from "../models/api/ebook";
import UserDTO from "../models/api/userDTO";

export interface CreateReview {
    date: string,
    book: Ebook,
    reviewer: UserDTO,
    opinion: string,
    grade: number
}


class ReviewService {
    private api: string = "https://localhost:7270/Review";

    create(request: CreateReview){
        return axios.post(this.api, request)
    }
}

export default new ReviewService();