import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import React from "react";
import BasicTextField from "../../components/BasicTextField";
import { NotificationContext } from "../../context/NotificationContext";
import FormService from "../../services/FormService";
import UserService from "../../services/UserService";
import InsertEmail from "./InsertEmail";
import InsertToken from "./InsertToken";

enum State {
  InsertEmail,
  InsertToken
}

const ResetPassword = () => {
  const [open, setOpen] = React.useState<boolean>(false);

  const [actualState, setActualState] = React.useState<State>(State.InsertEmail)

  const [email, setEmail] = React.useState<string>("")

  const setNextState = () => {
    setActualState(actualState + 1)
  }

  const handleClose = () => {
    setOpen(false);
    setActualState(State.InsertEmail)
  };

  const getStateView = () => {
    switch(actualState){
      case State.InsertEmail:
        return <InsertEmail email={email} setEmail={setEmail} setNextState={setNextState}/>
      case State.InsertToken:
        return <InsertToken email={email} handleClose={handleClose}/>
    }
  }

  return (
    <React.Fragment>
      <Button onClick={() => setOpen(true)} style={{ alignSelf: "start" }}>
        Nie pamiętam hasła
      </Button>
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
          Resetowanie hasła
        </DialogTitle>
        <DialogContent>
          <Grid item container justifyContent="center">
            <Grid item xs={8}>
              {getStateView()}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default ResetPassword;
