import { Star, StarBorder } from "@mui/icons-material";
import { Rating } from "@mui/material";

const Rate = (props: {
  value: number;
  editable?: boolean;
  onChange?: (newValue: number) => void;
}) => {
  return (
    <Rating
      readOnly={props.editable != undefined ? !props.editable : true}
      size="large"
      value={props.value}
      icon={<Star htmlColor="#0A3F5C" />}
      emptyIcon={<StarBorder htmlColor="#0A3F5C" />}
      onChange={(event, newValue) => {
        props.onChange ? props.onChange(newValue ? newValue : 0) : null;
      }}
    />
  );
};

export default Rate;
