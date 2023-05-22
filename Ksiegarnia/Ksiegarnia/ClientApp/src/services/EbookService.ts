import axios from "axios";
import { EbookSortOptions } from "../models/ebookSortOptions";
import EbookSearchCriteria from "../models/ebookSearchCriteria";
import Ebook from "../models/api/ebook";
import Genre from "../models/api/genre";
import UserDTO from "../models/api/userDTO";

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
  private host: string = "https://localhost:7270"
  private api: string = `${this.host}/Books`;

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

  create(createEbookProps: CreateEbookProps) {
    return axios.post(this.api, createEbookProps);
  }

  update(ebookId: string, updateEbookProps: UpdateEbookProps) {
    return axios.put(`${this.api}/${ebookId}`, updateEbookProps);
  }

  delete(ebookId: string) {
    return axios.delete(`${this.host}/${ebookId}`);
  }
}

export default new EbookService();
