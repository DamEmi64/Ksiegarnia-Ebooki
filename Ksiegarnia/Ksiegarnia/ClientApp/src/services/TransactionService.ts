import axios, { AxiosResponse } from "axios";
import { TransactionType } from "../models/api/transactionType";
import { Currency } from "../models/api/currency";
import EbookService from "./EbookService";
import UserService from "./UserService";
import { Distinction } from "../models/api/distinction";

class TransactionService {
  private api = `${process.env.REACT_APP_API}/Transactions`;

  getUserStats = (userId: string) => {
    return axios.get(`${this.api}/${userId}/summary`);
  };

  sendCash = (userId: string, cash: number) => {
    console.log({
      userId: userId,
      cash: cash,
      currency: "PLN",
    });
    return axios.post(`${this.api}`, {
      userId: userId,
      cash: cash,
      currency: "PLN",
    });
  };

  finishSendCash = (
    transactionId: string,
    succeeded: boolean,
    paymentId: string,
    token: string,
    payerId: string
  ) => {
    return axios.get(`${this.api}/SendCashFinish/${transactionId}`, {
      params: {
        succeeded: succeeded,
        paymentId: paymentId,
        token: token,
        PayerID: payerId,
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

  finishTransaction = (
    transactionId: string,
    succeeded: boolean,
    paymentId: string,
    token: string,
    payerId: string
  ) => {
    return axios.post(
      `${this.api}/Finish/${transactionId}`,
      {},
      {
        params: {
          succeeded: succeeded,
          paymentId: paymentId,
          token: token,
          PayerID: payerId,
        },
      }
    );
  };

  buyDistinction = (userId: string) => {
    const numberOfDistinctions = 1;
    return axios.post(`${this.api}/distinct/buy`, numberOfDistinctions, {
      params: {
        userId: userId,
      },
    });
  };

  finishDistinctTransaction = (
    transactionId: string,
    succeeded: boolean,
    paymentId: string,
    token: string,
    payerId: string
  ) => {
    const numberOfDistinctions = 1;
    return axios.post(
      `${this.api}/FinishDistinct/${transactionId}`,
      {},
      {
        params: {
          successed: succeeded,
          no: numberOfDistinctions,
          paymentId: paymentId,
          token: token,
          PayerID: payerId,
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
