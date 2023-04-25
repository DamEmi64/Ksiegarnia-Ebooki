import axios from "axios"

class PremiumService {

    private api: string = "https://localhost:7270/Premium"

    checkPremium(userId: string){
        return axios.get(`${this.api}/${userId}/Check`)
    }
}

export default new PremiumService()