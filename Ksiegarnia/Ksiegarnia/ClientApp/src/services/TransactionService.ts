import axios from "axios";

class TransactionService {
  private api = "https://localhost:7270/Transactions";

  getUserTransactions = (
    userId: string,
    page?: number,
    pageSize?: number
  ) => {
    return axios.get(this.api, {
      params: {
        userId,
        page,
        pageSize,
      },
    });
  };

  handleTransaction = (
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
          transactionType: "Token", //docelowo Paypal
          tokens: giftTokens
        },
        paramsSerializer: {
          indexes: null // by default: false
        }
      }
    );
  };
}

export default new TransactionService();
