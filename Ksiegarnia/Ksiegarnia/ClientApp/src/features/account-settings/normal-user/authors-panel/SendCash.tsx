import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import React, { useContext } from "react";
import BasicTextField from "../../../../components/BasicTextField";
import { UserContext } from "../../../../context/UserContext";
import TransactionService from "../../../../services/TransactionService";
import Loading from "../../../../pages/Loading";
import { NotificationContext } from "../../../../context/NotificationContext";

const SendCash = () => {
  const userContext = useContext(UserContext);
  const userId = userContext?.user.data?.id;

  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  const walletSize = userContext?.user.data?.wallet as number;

  const [cash, setCash] = React.useState<number>(walletSize);
  const [cashError, setCashError] = React.useState<string>("");

  const notificationContext = React.useContext(NotificationContext);

  const NEGATIVE_VALUE = "Niepoprawna wartość";
  const TOO_LARGE_VALUE = "Zbyt duża kwota";
  const SUCCESSFULL_MESSAGE = "Wypłacono pieniądze";
  const FAILED_MESSAGE = "Nie istnieje konto PayPal o takim e-mailu";

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!userContext) {
    return <Loading />;
  }

  const handleSendCash = () => {
    if (cash < 0) {
      setCashError(NEGATIVE_VALUE);
      return;
    }

    if (cash > walletSize) {
      setCashError(TOO_LARGE_VALUE);
      return;
    }

    TransactionService.sendCash(userId as string, cash)
      .then((response) => {
        userContext.setWallet(walletSize - cash);
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: true,
          message: SUCCESSFULL_MESSAGE,
        });
        setIsVisible(false);
      })
      .catch((error) => {
        console.log(error)
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: false,
          message: FAILED_MESSAGE,
        });
        setIsVisible(false);
      });
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        onClick={() => setIsVisible(true)}
        style={{ marginLeft: 12 }}
      >
        Wypłać
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={isVisible}
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
          Wypłacenie
        </DialogTitle>
        <DialogContent>
          <Grid item container justifyContent="center" marginBottom={3}>
            <Grid item xs={11} md={8} container rowGap={4}>
              <Grid item container justifyContent="center" rowGap={4}>
                <BasicTextField
                  label="Kwota"
                  value={cash.toString()}
                  settings={{
                    type: "number",
                    inputProps: {
                      min: 0.01,
                      max: walletSize,
                    },
                  }}
                  errorMessage={cashError}
                  handleChange={(value: string) => {
                    setCash(+value);
                    setCashError("");
                  }}
                  fullWidth={true}
                />
                <Button
                  fullWidth
                  variant="contained"
                  style={{ paddingTop: 10, paddingBottom: 10, marginTop: 4 }}
                  onClick={handleSendCash}
                >
                  Wypłać
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default SendCash;
