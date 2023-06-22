import axios from "axios";

export interface BuyPremiumRequest {
  isActive: boolean;
  userId: string;
  buyDate: string;
  days: number;
  prize: number;
}

class PremiumService {
  private api = `${process.env.REACT_APP_API}/Premium`;

  buyPremium(request: BuyPremiumRequest) {
    return axios.post(`${this.api}/buy`, request, {
      params: { currency: "PLN" },
    });
  }

  finishPremiumTransaction(transactionId: string, succeeded: boolean, paymentId: string, token: string, payerId: string) {
    return axios.post(`${this.api}/Finish/${transactionId}`, {}, {
      params: {
        succeeded: succeeded,
          paymentId: paymentId,
          token: token,
          PayerID: payerId
      }
    });
  }

  checkPremium(userId: string) {
    return axios.get(`${this.api}/${userId}/Check`);
  }
}

export default new PremiumService();
