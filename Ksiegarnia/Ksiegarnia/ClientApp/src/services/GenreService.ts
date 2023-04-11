import axios from "axios"

class GenreService {

    private api: string = "https://localhost:7270/Genres"

    getAll(){
        return axios.get(this.api)
    }
}

export default new GenreService()