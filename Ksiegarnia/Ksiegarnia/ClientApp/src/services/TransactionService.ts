import axios from "axios";

class TransactionService {
  private api: string = "https://localhost:7270/Transactions";

  getUserTransactions = (
    userId: string,
    authorId: string,
    page?: number,
    pageSize?: number
  ) => {
    return axios.get(this.api, {
      params: {
        userId,
        authorId,
        page,
        pageSize,
      },
    });
  };

  handleTransaction = (userId: string, bookIds: string[]) => {
    return axios.post(
      `${this.api}/buy`,
      {
        buyerId: userId,
        bookIds: bookIds,
      },
      {
        params: {
          transactionType: "Token", //docelowo Paypal
        },
      }
    );
  };
}

export default new TransactionService();
