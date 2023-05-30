import axios from "axios";
import EbookSearchCriteria from "../models/ebookSearchCriteria";
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

export interface CreateDistinction {
  startDate: string;
  howLong: number;
}

class EbookService {
  private host = "https://localhost:7270"
  private api = `${this.host}/Books`;

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

  create(createEbookProps: CreateEbookProps) {
    return axios.post(this.api, createEbookProps);
  }

  update(ebookId: string, updateEbookProps: UpdateEbookProps) {
    return axios.put(`${this.api}/${ebookId}`, updateEbookProps);
  }

  distinct(ebookId: string, createDistinction: CreateDistinction){
    return axios.post(`${this.api}/${ebookId}/distinct`, createDistinction)
  }

  delete(ebookId: string) {
    return axios.delete(`${this.host}/${ebookId}`);
  }
}

export default new EbookService();
