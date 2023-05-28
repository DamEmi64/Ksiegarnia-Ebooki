import axios from "axios";
import { TransactionType } from "../models/api/transactionType";
import { Currency } from "../models/api/currency";

class TransactionService {
  private api = "https://localhost:7270/Transactions";

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
          currency: Currency.PLN
        },
        paramsSerializer: {
          indexes: null, // by default: false
        },
      }
    );
  };

  handleTransactionByTokens = (
    userId: string,
    bookIds: string[],
    giftTokens: string[]
  ) => {
    return axios.post(
      `${this.api}/buy`,
      {
        buyerId: userId,
        bookIds: bookIds,
      },
      {
        params: {
          transactionType: TransactionType.TOKEN,
          tokens: giftTokens,
          currency: Currency.PLN
        },
        paramsSerializer: {
          indexes: null, // by default: false
        },
      }
    );
  };
}

export default new TransactionService();
