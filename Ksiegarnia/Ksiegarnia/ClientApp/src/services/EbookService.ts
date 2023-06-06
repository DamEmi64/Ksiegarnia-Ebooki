import axios from "axios";
import EbookSearchCriteria from "../models/ebookSearchCriteria";
import Genre from "../models/api/genre";
import UserDTO from "../models/api/userDTO";
import { Promotion } from "../models/api/promotion";
import { Distinction } from "../models/api/distinction";

export interface SearchEbookProps {
  ebookSearchCriteria?: EbookSearchCriteria;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateEbookProps {
  title: string;
  genre: Genre;
  description: string;
  pageNumber: number;
  author: UserDTO;
  picture: string;
  prize: number;
  content: string;
}

export interface UpdateEbookProps {
  title: string;
  genre: Genre;
  description: string;
  pageNumber: number;
  author: UserDTO;
  picture: string;
  prize: number;
}

class EbookService {
  private api = `${process.env.REACT_APP_API}/Books`;

  getById(ebookId: string) {
    return axios.get(`${this.api}/${ebookId}`);
  }

  getContentById(ebookId: string) {
    return axios.get(`${this.api}/${ebookId}/read`);
  }

  search(props: SearchEbookProps) {
    return axios.get(`${this.api}/search`, {
      params: {
        ...props.ebookSearchCriteria,
        sort: props.sort,
        page: props.page,
        pageSize: props.pageSize,
      },
      paramsSerializer: {
        indexes: null // by default: false
      }
    });
  }

  getBestsellers(page?: number, pageSize?: number) {
    return axios.get(`${this.api}/bestseller`, {
      params: {
        page,
        pageSize,
      },
    });
  }

  getGiftTokens(ebookId: string){
    return axios.get(`${this.api}/${ebookId}/tokens`)
  }

  getGiftTokensFromEbooksList(ebooksIds: string[]){
    return axios.all(
      ebooksIds.map((ebookId: string) => this.getGiftTokens(ebookId))
    )
  }

  create(createEbookProps: CreateEbookProps) {
    return axios.post(this.api, createEbookProps);
  }

  update(ebookId: string, updateEbookProps: UpdateEbookProps) {
    return axios.put(`${this.api}/${ebookId}`, updateEbookProps);
  }

  distinct(ebookId: string, distinction: Distinction){
    return axios.post(`${this.api}/${ebookId}/distinct`, distinction)
  }

  promote(ebookId: string, promotion: Promotion){
    return axios.post(`${this.api}/${ebookId}/promote`, promotion)
  }

  deletePromotion(ebookId: string){
    return axios.post(`${this.api}/${ebookId}/promote`, {})
  }

  delete(ebookId: string) {
    return axios.delete(`${process.env.REACT_APP_API}/${ebookId}`);
  }
}

export default new EbookService();
