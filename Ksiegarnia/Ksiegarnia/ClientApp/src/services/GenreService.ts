import axios from "axios";

class GenreService {
  private api = `${process.env.REACT_APP_API}/Genres`;

  getAll() {
    return axios.get(this.api);
  }
}

export default new GenreService();
