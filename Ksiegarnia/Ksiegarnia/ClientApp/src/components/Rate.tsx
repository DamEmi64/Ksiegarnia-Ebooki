import { Star, StarBorder } from "@mui/icons-material";
import { Rating } from "@mui/material";

const Rate = (props: {value: number}) => {

    return (
        <Rating
            readOnly
            size="large"
            value={props.value}
            icon={<Star htmlColor="#0A3F5C"/>}
            emptyIcon={<StarBorder htmlColor="#0A3F5C"/>}
        />
    )
}

export default Rate;