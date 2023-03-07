import axios from "axios"

class ExampleService {

    test(){
        return axios.get("test/")
    }
}

export default new ExampleService()