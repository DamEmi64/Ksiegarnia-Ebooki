import axios, { AxiosResponse } from "axios";
import { TransactionType } from "../models/api/transactionType";
import { Currency } from "../models/api/currency";
import EbookService from "./EbookService";

class TransactionService {
  private api = "https://localhost:7270/Transactions";

  getUserStats = (userId: string) => {
    return axios.get(`${this.api}/${userId}/summary`, {
      params: {
        page: 1,
        pageSize: 1,
      },
    });
  };

  getUserTransactions = (userId: string, page?: number, pageSize?: number) => {
    return axios.get(this.api, {
      params: {
        userId,
        page,
        pageSize,
      },
    });
  };

  handleTransactionByPayPal = (userId: string, bookIds: string[]) => {
    return axios.post(
      `${this.api}/buy`,
      {
        buyerId: userId,
        bookIds: bookIds,
      },
      {
        params: {
          transactionType: TransactionType.PAYPAL,
          currency: Currency.PLN,
        },
        paramsSerializer: {
          indexes: null, // by default: false
        },
      }
    );
  };

  handleTransactionByTokens = (userId: string, bookIds: string[]) => {
    return EbookService.getGiftTokensFromEbooksList(bookIds)
    .then((response) => {
      let tokens: string[] = [];

      response.forEach((resp: AxiosResponse<any, any>) => {
        const firstToken = resp.data[2];
        tokens = [...tokens, firstToken];
      });

      return axios.post(
        `${this.api}/buy`,
        {
          buyerId: userId,
          bookIds: bookIds,
        },
        {
          params: {
            transactionType: TransactionType.TOKEN,
            tokens: tokens,
            currency: Currency.PLN,
          },
          paramsSerializer: {
            indexes: null, // by default: false
          },
        }
      );
    });
  };
}

export default new TransactionService();
