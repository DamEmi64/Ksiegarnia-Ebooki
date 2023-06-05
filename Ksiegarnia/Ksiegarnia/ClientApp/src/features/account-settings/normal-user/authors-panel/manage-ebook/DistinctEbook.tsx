import { Close } from "@mui/icons-material";
import {
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import BasicTextField from "../../../../../components/BasicTextField";
import FormService from "../../../../../services/FormService";
import EbookService from "../../../../../services/EbookService";
import { Distinction } from "../../../../../models/api/distinction";
import { NotificationContext } from "../../../../../context/NotificationContext";

const DistinctEbook = (props: {
  ebookId: string;
  ebookDistinction?: Distinction;
  update: () => void;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const [howLong, setHowLong] = React.useState<number>(0);
  const [howLongError, setHowLongError] = React.useState<string>("");

  const notificationContext = React.useContext(NotificationContext);

  const SUCCESSFULY_MESSAGE = "Wyróżniono ebooka";

  const handleClose = () => {
    setOpen(false);
  };

  const validateForm = () => {
    if (!howLong) {
      setHowLongError(FormService.requiredMessage);
      return false;
    }

    return true;
  };

  const handleDistinct = (isSelectedFreeDistinction: boolean) => {
    if (!validateForm()) {
      return;
    }

    EbookService.distinct(props.ebookId, {
      startDate: new Date().toISOString(),
      howLong: howLong,
    })
      .then((response) => {
        console.log(response);
        setOpen(false)
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: true,
          message: SUCCESSFULY_MESSAGE,
        });
        props.update();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      {!(props.ebookDistinction && props.ebookDistinction.howLong != 0) && (
        <Button
          fullWidth
          className="premium-button"
          variant="contained"
          style={{ borderRadius: 10 }}
          onClick={() => setOpen(true)}
        >
          Wyróżnij
        </Button>
      )}
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        style={{ borderRadius: 12 }}
      >
        <IconButton
          onClick={handleClose}
          style={{ position: "absolute", right: 12, top: 12 }}
        >
          <Close fontSize="large" />
        </IconButton>
        <DialogTitle
          variant="h5"
          textAlign="center"
          marginTop={2}
          marginBottom={6}
        >
          Wyróżnienie ebooka
        </DialogTitle>
        <DialogContent>
          <Grid item container justifyContent="center" marginBottom={3}>
            <Grid item xs={11} md={8} container rowGap={4}>
              <BasicTextField
                label="Czas trwania (tyg.)"
                settings={{ type: "number" }}
                value={howLong.toString()}
                errorMessage={howLongError}
                handleChange={(value: string) => {
                  setHowLong(+value);
                  setHowLongError("");
                }}
              />
              <Grid item container rowGap={2}>
                <Button
                  fullWidth
                  variant="contained"
                  className="premium-button"
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                  onClick={() => handleDistinct(true)}
                >
                  Wykorzystaj darmowe wyróżnienie
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  style={{ paddingTop: 10, paddingBottom: 10, marginTop: 4 }}
                  onClick={() => handleDistinct(false)}
                >
                  Zakup wyróżnienie
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default DistinctEbook;
