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
import { UserContext } from "../../../../../context/UserContext";
import Loading from "../../../../../pages/Loading";
import UserService from "../../../../../services/UserService";
import TransactionService from "../../../../../services/TransactionService";
import { TransactionContext } from "../../../../../context/TransactionContext";

const DistinctEbook = (props: {
  ebookId: string;
  ebookDistinction?: Distinction;
  update: () => void;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const [howLong, setHowLong] = React.useState<number>(1);
  const [howLongError, setHowLongError] = React.useState<string>("");

  const userContext = useContext(UserContext);
  const userId = userContext?.user.data?.id
  const transactionContext = useContext(TransactionContext)
  const notificationContext = React.useContext(NotificationContext);

  const SUCCESSFULY_MESSAGE = "Wyróżniono ebooka";
  const SUCCESSFULY_PLACED_TRANSACTION_MESSAGE = "Złożono zamówienie";
  const FAILED_MESSAGE = "Nie udało się wyróżnic ebooka";

  if (!userContext) {
    return <Loading />;
  }

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

  const handleFreeDistinct = (distinction: Distinction) => {
    EbookService.distinct(props.ebookId, distinction)
    .then((response) => {
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: true,
        message: SUCCESSFULY_MESSAGE,
      });
      handleClose()
      userContext.setNumberOfDistinctions(userContext.user.numberOfDistinctions - 1)
      props.update()
    })
    .catch((error) => {
      console.log(error)
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: false,
        message: FAILED_MESSAGE,
      });
    });
  }

  const handlePaidDistinct = (distinction: Distinction) => {
    TransactionService.buyDistinction(userId as string)
    .then((response) => {
      const paypalRedirect = response.data
      console.log(response)
      
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: true,
        message: SUCCESSFULY_PLACED_TRANSACTION_MESSAGE,
      });
      transactionContext?.setDistinctionDetails({
        ...distinction,
        ebookId: props.ebookId
      })
      handleClose()
      props.update()

      window.location.href = paypalRedirect;
    })
  }

  const handleDistinct = (isSelectedFreeDistinction: boolean) => {
    if (!validateForm()) {
      return;
    }

    const request: Distinction = {
      startDate: new Date().toISOString(),
      howLong: howLong,
    }

    if (isSelectedFreeDistinction) {
     handleFreeDistinct(request)
    }
    else{
      handlePaidDistinct(request)
    }
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
          marginBottom={4}
        >
          Wyróżnienie ebooka (1 tydz.)
        </DialogTitle>
        <DialogContent>
          <Grid item container justifyContent="center" marginBottom={3}>
            <Grid item xs={11} md={8} container rowGap={4}>
              <Grid item container rowGap={2}>
                {userContext?.user.numberOfDistinctions > 0 && (
                  <Button
                    fullWidth
                    variant="contained"
                    className="premium-button"
                    style={{ paddingTop: 10, paddingBottom: 10 }}
                    onClick={() => handleDistinct(true)}
                  >
                    Wykorzystaj darmowe wyróżnienie
                  </Button>
                )}
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
