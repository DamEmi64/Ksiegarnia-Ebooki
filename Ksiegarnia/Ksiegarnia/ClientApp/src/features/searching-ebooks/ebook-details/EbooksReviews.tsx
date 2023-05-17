import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import BasicTextField from "../../../components/BasicTextField";
import { UserContext } from "../../../context/UserContext";
import AddEbookReview from "./AddEbookReview";
import { Review } from "../../../models/api/review";

interface MockReview {
  date: string;
  reviewer: string;
  grade: number;
}

const reviews: MockReview[] = [
  {
    date: new Date().toLocaleDateString(),
    reviewer: "Adam Nowak",
    grade: 4.4,
  },
  {
    date: new Date().toLocaleDateString(),
    reviewer: "Jan Kowalski",
    grade: 3,
  },
  {
    date: new Date().toLocaleDateString(),
    reviewer: "Michał Nowak",
    grade: 5,
  },
  {
    date: new Date().toLocaleDateString(),
    reviewer: "Jan Nowak",
    grade: 2.5,
  },
  {
    date: new Date().toLocaleDateString(),
    reviewer: "Adam Kowalski",
    grade: 4.8,
  },
];

const EbooksReviews = (props: { ebookId: string }) => {
  const userId = useContext(UserContext)?.user.data?.id;

  const [isAddingReview, setIsAddingReview] = useState<boolean>(false);

  return (
    <Grid item container direction="column" rowGap={1} marginBottom={2}>
      <Typography variant="h5" marginBottom={2} fontWeight="bold">
        Recenzje (32)
      </Typography>
      <Grid item container direction="column" rowGap={1}>
        {userId !== props.ebookId && !isAddingReview ? (
          <Grid item>
            <Button variant="contained" onClick={() => setIsAddingReview(true)}>
              Dodaj recenzję
            </Button>
          </Grid>
        ) : (
          <AddEbookReview handleClose={() => setIsAddingReview(false)} />
        )}
      </Grid>
    </Grid>
  );
};

export default EbooksReviews;
