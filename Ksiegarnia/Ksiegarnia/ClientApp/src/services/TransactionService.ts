import axios, { AxiosResponse } from "axios";
import { TransactionType } from "../models/api/transactionType";
import { Currency } from "../models/api/currency";
import EbookService from "./EbookService";
import UserService from "./UserService";

class TransactionService {
  private api = `${process.env.REACT_APP_API}/Transactions`;

  getUserStats = (userId: string) => {
    return axios.get(`${this.api}/${userId}/summary`);
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

  finishTransaction = (transactionId: string, succeeded: boolean) => {
    return axios.post(
      `${this.api}/Finish/${transactionId}`,
      {},
      {
        params: {
          succeeded: succeeded,
        },
      }
    );
  };

  handleTransactionByTokens = (userId: string, bookIds: string[]) => {
    return EbookService.getGiftTokensFromEbooksList(bookIds).then(
      (response) => {
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
      }
    );
  };
}

export default new TransactionService();
