import { Button, Grid, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import AddEditEbookReview from "./AddEditEbookReview";
import EbookReview from "./EbookReview";
import Ebook from "../../models/api/ebook";
import { Review } from "../../models/api/review";
import ReviewService from "../../services/ReviewService";
import PagedResponse from "../../models/api/pagedResponse";

const EbooksReviews = (props: { ebook: Ebook }) => {
  const userContext = useContext(UserContext);
  const isUserLogged = userContext?.user.logged;
  const userId = userContext?.user.data?.id;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState<number>(0);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [numberOfReviews, setNumberOfReviews] = useState<number>(0);
  const pageSize = 5;

  const [isAddingReview, setIsAddingReview] = useState<boolean>(false);

  useEffect(() => {
    if (page > 1) {
      handleSearch();
    } else {
      handleSearchWithReplace();
    }
  }, [page]);

  const handleSearch = () => {
    ReviewService.getEbookReviews(props.ebook.id, page, pageSize).then(
      (response) => {
        console.log(response.data);
        const pagedResponse: PagedResponse = response.data;
        setReviews([...reviews, ...pagedResponse.result]);
        setPage(pagedResponse.page);
        setNumberOfPages(pagedResponse.number_of_pages);
        setNumberOfReviews(pagedResponse.all);
      }
    );
  };

  const handleSearchWithReplace = () => {
    ReviewService.getEbookReviews(props.ebook.id, page, pageSize).then(
      (response) => {
        console.log(response.data);
        const pagedResponse: PagedResponse = response.data;
        setReviews(pagedResponse.result);
        setPage(pagedResponse.page);
        setNumberOfPages(pagedResponse.number_of_pages);
        setNumberOfReviews(pagedResponse.all);
      }
    );
  };

  return (
    <Grid item container direction="column" rowGap={1} marginBottom={2}>
      <Typography variant="h5" marginBottom={2} fontWeight="bold">
        Recenzje ({numberOfReviews})
      </Typography>
      <Grid item container direction="column" rowGap={1}>
        {isUserLogged &&
          userContext.containsEbookId(props.ebook.id) &&
          userId !== props.ebook.author.id &&
          (!isAddingReview ? (
            <Grid item marginBottom={2}>
              <Button
                variant="contained"
                onClick={() => setIsAddingReview(true)}
              >
                Dodaj recenzję
              </Button>
            </Grid>
          ) : (
            <AddEditEbookReview
              ebook={props.ebook}
              handleUpdate={handleSearchWithReplace}
              handleClose={() => setIsAddingReview(false)}
            />
          ))}
        <Grid item container direction="column" rowGap={4}>
          {reviews.map((review: Review, index: number) => (
            <EbookReview
              key={index}
              ebook={props.ebook}
              review={review}
              handleUpdate={handleSearchWithReplace}
            />
          ))}
          {page < numberOfPages && (
            <Typography
              variant="h6"
              fontWeight="bold"
              className="pointer hover-red"
              onClick={() => setPage(page + 1)}
            >
              Pokaż więcej...
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EbooksReviews;
