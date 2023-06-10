import { Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { MockReview } from "./EbooksReviews";
import Rate from "../../components/EbookRate";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { MoreVert } from "@mui/icons-material";
import React from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import AddEditEbookReview from "./AddEditEbookReview";
import Ebook from "../../models/api/ebook";
import ReviewService from "../../services/ReviewService";
import { NotificationContext } from "../../context/NotificationContext";
import { Review } from "../../models/api/review";
import { Role } from "../../models/api/role";

const EbookReview = (props: {
  ebook: Ebook;
  review: Review;
  handleUpdate: () => void;
}) => {
  const userContext = useContext(UserContext);
  const userId = userContext?.user.data?.id;
  const isUserAdmin = userContext?.containsRole(Role.Admin);

  const notificationContext = useContext(NotificationContext);

  const [review, setReview] = useState<Review>(props.review);

  const [anchorReviewOptions, setAchnorReviewOptions] =
    React.useState<null | HTMLElement>(null);
  const openReviewOptions = Boolean(anchorReviewOptions);

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

  const SUCCESSFULLY_DELETED_MESSAGE = "Usunięto recenzję";
  const FAILED_DELETED_MESSAGE = "Nie udało się usunąć recenzji";

  useEffect(() => {
    setReview(props.review);
  }, [props.review]);

  const handleClickReviewOption = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAchnorReviewOptions(event.currentTarget);
  };

  const handleCloseReviewOptions = () => {
    setAchnorReviewOptions(null);
  };

  const handleDelete = () => {
    ReviewService.delete("1")
      .then((response) => {
        console.log(response);
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: true,
          message: SUCCESSFULLY_DELETED_MESSAGE,
        });
        props.handleUpdate();
      })
      .catch((error) => {
        console.log(error);
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: false,
          message: FAILED_DELETED_MESSAGE,
        });
      });

    setOpenDeleteDialog(false);
    handleCloseReviewOptions();
  };

  return (
    <Grid item container direction="column" rowGap={2}>
      <Grid item container alignItems="center" columnGap={1}>
        <Typography variant="h6" fontWeight="bold">
          {review.reviewer.nick}
        </Typography>
        <Typography variant="h6">{review.date}</Typography>
        {(isUserAdmin || userId === review.reviewer.id) && (
          <React.Fragment>
            <IconButton
              style={{ marginTop: -3 }}
              onClick={handleClickReviewOption}
            >
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorReviewOptions}
              open={openReviewOptions}
              onClose={handleCloseReviewOptions}
            >
              <MenuItem
                onClick={() => {
                  setOpenEditDialog(true);
                  handleCloseReviewOptions();
                }}
              >
                Edytuj
              </MenuItem>
              <MenuItem onClick={() => setOpenDeleteDialog(true)}>
                Usuń
              </MenuItem>
            </Menu>
            <ConfirmationDialog
              message="Czy na pewno usunąć recenzję?"
              open={openDeleteDialog}
              handleAccept={handleDelete}
              handleDecline={() => {
                setOpenDeleteDialog(false);
                handleCloseReviewOptions();
              }}
            />
          </React.Fragment>
        )}
      </Grid>
      {!openEditDialog ? (
        <React.Fragment>
          <Rate value={review.grade} />
          <Typography variant="h6">{review.opinion}</Typography>
        </React.Fragment>
      ) : (
        <AddEditEbookReview
          ebook={props.ebook}
          review={review}
          handleUpdate={props.handleUpdate}
          handleClose={() => setOpenEditDialog(false)}
        />
      )}
    </Grid>
  );
};

export default EbookReview;
