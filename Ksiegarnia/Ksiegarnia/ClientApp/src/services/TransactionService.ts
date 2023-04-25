import axios from "axios"

class TransactionService {

    private api: string = "https://localhost:7270/Transactions"

    getUserTransactions = (userId: string, authorId: string, page?: number, pageSize?: number) => {
        return axios.get(this.api, {
            params: {
                userId,
                authorId,
                page,
                pageSize
            }
        })
    } 
}

export default new TransactionService()