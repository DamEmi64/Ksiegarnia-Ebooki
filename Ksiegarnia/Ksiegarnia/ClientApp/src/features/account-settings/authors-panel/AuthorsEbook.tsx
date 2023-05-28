import { Button, Grid, Typography } from "@mui/material";
import Ebook from "../../../models/api/ebook";
import React, { useContext, useEffect, useState } from "react";
import Rate from "../../../components/Rate";
import { useNavigate } from "react-router-dom";
import Image from "../../../components/Image";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import EbookService from "../../../services/EbookService";
import { NotificationContext } from "../../../context/NotificationContext";

const AuthorsEbook = (props: { ebook: Ebook, update: () => void }) => {
  const [ebook, setEbook] = useState<Ebook>(props.ebook);
  const [visibleDeleteConfirmation, setVisibleDeleteConfirmation] =
    useState<boolean>(false);

  const notificationContext = useContext(NotificationContext);

  const DELETED_SUCCESSFULY_MESSAGE = "Zalogowano pomyślnie"
  const DELETED_FAILED_MESSAGE = "Nie istnieje konto o takim adresie e-mail i/lub haśle"

  const navigate = useNavigate();

  useEffect(() => {
    setEbook(props.ebook);
  }, [props.ebook]);

  const handleDelete = () => {
    EbookService.delete(ebook.id)
    .then(() => {
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: true,
        message: DELETED_SUCCESSFULY_MESSAGE
      })
      props.update()
    })
    .catch(() => {
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: false,
        message: DELETED_FAILED_MESSAGE
      })
    })
  };

  return (
    <Grid key={ebook.id} item xs={12} sm={6} md={4} lg={3} xl={2.4} container justifyContent="center">
      <Grid item xs={10} className="ebook ebook-rounded">
        <Grid item container direction="column" alignItems="stretch" rowGap={2}>
          <Grid
            item
            height="220px"
            className="pointer"
            container
            justifyContent="center"
            alignItems="center"
            onClick={() => navigate(`/Ebook/${ebook.id}`)}
          >
            <Image
              alt={ebook.title}
              src={ebook.picture}
              style={{ maxWidth: "100%", width: "auto", height: "100%" }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6" textAlign="center">
              {ebook.title}
            </Typography>
          </Grid>
          <Grid item container justifyContent="center" columnGap={1}>
            <Typography variant="h6">Przychód:</Typography>
            <Typography variant="h6" fontWeight="bold">
              200 zł
            </Typography>
          </Grid>
          <Grid item container justifyContent="center">
            <Rate value={5} />
          </Grid>
          <Grid item xs={6} container justifyContent="center" marginTop={1}>
            <Button
              fullWidth
              variant="contained"
              style={{ borderRadius: 10 }}
              onClick={() => navigate(`/ebook/${ebook.id}/edit`)}
            >
              Edytuj
            </Button>
          </Grid>
          <Grid item xs={6} container justifyContent="center">
            <Button
              fullWidth
              className="premium-button"
              variant="contained"
              style={{ borderRadius: 10 }}
              onClick={() => setVisibleDeleteConfirmation(true)}
            >
              Wyróżnij
            </Button>
          </Grid>
          <Grid item xs={6} container justifyContent="center">
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              style={{ borderRadius: 10 }}
              onClick={() => setVisibleDeleteConfirmation(true)}
            >
              Usuń
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <ConfirmationDialog
        message="Czy na pewno chcesz usunąć ebooka?"
        open={visibleDeleteConfirmation}
        handleDecline={() => setVisibleDeleteConfirmation(false)}
        handleAccept={handleDelete}
      />
    </Grid>
  );
};

export default AuthorsEbook;
