import axios from "axios"

class TransactionService {

    private api: string = "https://localhost:7270/Transactions"

    getUserTransactions = (userId: string) => {
        return axios.get(this.api, {
            params: {
                userId
            }
        })
    } 
}

export default new TransactionService()