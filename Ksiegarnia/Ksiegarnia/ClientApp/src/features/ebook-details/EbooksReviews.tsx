import { Button, Grid, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import AddEditEbookReview from "./AddEditEbookReview";
import EbookReview from "./EbookReview";
import Ebook from "../../models/api/ebook";
import { Review } from "../../models/api/review";
import ReviewService from "../../services/ReviewService";
import PagedResponse from "../../models/api/pagedResponse";

export interface MockReview {
  date: string;
  reviewer: string;
  opinion: string;
  reviewerId: string;
  grade: number;
}

const movkedReviews: MockReview[] = [
  {
    date: new Date().toLocaleDateString(),
    reviewer: "Adam Nowak",
    opinion: "Dobry ebook",
    reviewerId: "1536b03f-30f7-4d6d-9eb7-3a2fcefd4fae",
    grade: 4.4,
  },
  {
    date: new Date().toLocaleDateString(),
    reviewer: "Jan Kowalski",
    opinion: "Niezły ebook",
    reviewerId: "2",
    grade: 3,
  },
  {
    date: new Date().toLocaleDateString(),
    reviewer: "Michał Nowak",
    opinion: "Wspaniały ebook",
    reviewerId: "3",
    grade: 5,
  },
  {
    date: new Date().toLocaleDateString(),
    reviewer: "Jan Nowak",
    reviewerId: "4",
    grade: 2.5,
    opinion: "Niezbyt dobry ebook",
  },
  {
    date: new Date().toLocaleDateString(),
    reviewer: "Adam Kowalski",
    opinion: "Ciekawy ebook",
    reviewerId: "5",
    grade: 4.8,
  },
];

const EbooksReviews = (props: { ebook: Ebook }) => {
  const userContext = useContext(UserContext);
  const isUserLogged = userContext?.user.logged;
  const userId = userContext?.user.data?.id;

  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState<number>(0);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [numberOfReviews, setNumberOfReviews] = useState<number>(0);
  const pageSize = 10;

  const [isAddingReview, setIsAddingReview] = useState<boolean>(false);

  useEffect(() => {
    handleSearch();
  }, [page]);

  const handleSearch = () => {
    ReviewService.getEbookReviews(props.ebook.id, page, pageSize).then(
      (response) => {
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
              handleUpdate={() => console.log("Updated")}
              handleClose={() => setIsAddingReview(false)}
            />
          ))}
        <Grid item container direction="column" rowGap={4}>
          {reviews.map((review: Review, index: number) => (
            <EbookReview
              key={index}
              ebook={props.ebook}
              review={review}
              handleUpdate={handleSearch}
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
