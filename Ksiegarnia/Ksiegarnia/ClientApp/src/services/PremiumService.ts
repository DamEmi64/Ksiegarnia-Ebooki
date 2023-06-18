import axios from "axios";

export interface BuyPremiumRequest {
  isActive: boolean;
  userId: string;
  buyDate: string;
  days: number;
}

class PremiumService {
  private api = `${process.env.REACT_APP_API}/Premium`;

  buyPremium(request: BuyPremiumRequest) {
    return axios.post(`${this.api}/buy`, request, {
      params: { currency: "PLN" },
    });
  }

  finishPremiumTransaction(transactionId: string, succeeded: boolean){
    return axios.post(`${this.api}/Finish/${transactionId}`)
  }

  checkPremium(userId: string) {
    return axios.get(`${this.api}/${userId}/Check`);
  }
}

export default new PremiumService();
