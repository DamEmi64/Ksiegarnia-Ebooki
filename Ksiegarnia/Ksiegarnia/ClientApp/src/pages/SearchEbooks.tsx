import { useSearchParams } from "react-router-dom";
import CategoriesContent from "../layouts/CategoriesContent";

const SearchEbooks = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    console.log(searchParams)

    console.log(searchParams.get("name"))

    return (
       <CategoriesContent>
        Wyszukiwarka ebooków
       </CategoriesContent>
    )
}

export default SearchEbooks;