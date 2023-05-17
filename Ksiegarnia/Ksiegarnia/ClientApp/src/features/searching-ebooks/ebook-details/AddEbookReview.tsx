import { Grid, FormControl, TextField, FormHelperText, Button } from "@mui/material";
import { useState } from "react";
import FormService from "../../../services/FormService";

const AddEbookReview = (props: {handleClose: () => void}) => {
  const [review, setReview] = useState<string>("");
  const [reviewError, setReviewError] = useState<string>("");

  const close = () => {
    props.handleClose()
  };

  const handleAdd = () => {

    if(!FormService.checkIfIsRequired(review)){
      setReviewError(FormService.requiredMessage)
      return;
    }

    close();
  };

  return (
    <Grid item container rowGap={2}>
      <FormControl fullWidth={true}>
        <TextField
          fullWidth
          placeholder="Treść recenzji"
          multiline={true}
          rows={2}
          value={review}
          error={reviewError !== ""}
          onChange={(event: any) => setReview(event.target.value)}
        />
        <FormHelperText error>{reviewError ? reviewError : " "}</FormHelperText>
      </FormControl>
      <Button
        variant="contained"
        style={{ marginRight: 12 }}
        onClick={handleAdd}
      >
        Dodaj
      </Button>
      <Button variant="contained" color="secondary" onClick={close}>
        Anuluj
      </Button>
    </Grid>
  );
};

export default AddEbookReview;
