import axios from "axios";

class PlagiarismService {
  private api = `${process.env.REACT_APP_API}/Plagiarism`;

  submit(bookId: string, content: string){
    return axios.post(`${this.api}/submit`, {
        bookId: bookId,
        content: content
    })
  }

  checkResults(scanId: string){
    return axios.get(`${this.api}/${scanId}/checkResults`)
  }
}

export default new PlagiarismService();
