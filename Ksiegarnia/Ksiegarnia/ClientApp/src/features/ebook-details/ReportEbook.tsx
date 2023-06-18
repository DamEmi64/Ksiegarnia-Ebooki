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
import FormService from "../../services/FormService";
import AdminService, { CreateNotitifaction } from "../../services/AdminService";
import Notification from "../../models/api/notification";
import { UserContext } from "../../context/UserContext";
import UserDTO from "../../models/api/userDTO";
import { NotificationStatus } from "../../models/api/notificationStatus";
import { NotificationContext } from "../../context/NotificationContext";

const ReportEbook = (props: {ebookId: string}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const [descripton, setDescription] = React.useState<string>("");
  const [descriptionError, setDescriptionError] = React.useState<string>("");

  const userData = React.useContext(UserContext)?.user.data as UserDTO
  const notificationContext = React.useContext(NotificationContext)

  const SUCCESSFUL_MESSAGE = "Utworzono zgłoszenie"

  const handleClose = () => {
    setOpen(false);
    setDescriptionError("")
  };

  const handleReport = () => {

    if(!FormService.checkIfIsRequired(descripton)){
        setDescriptionError(FormService.requiredMessage)
        return;
    }

    const creationDate = new Date().toISOString()

    const request: CreateNotitifaction = {
      objectId: props.ebookId,
      user: userData,
      description: descripton,
      status: NotificationStatus.Reported,
      creationDate: creationDate,
      statusChangeDate: creationDate,
      type: "Ebook"
    }

    AdminService.createNotification(request)
    .then(() => {
      handleClose()
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: true,
        message: SUCCESSFUL_MESSAGE
      })
    })
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="secondary"
        style={{ paddingLeft: 28, paddingRight: 28 }}
        onClick={() => setOpen(true)}
      >
        Zgłoś
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
          marginBottom={0}
        >
          Zgłoszenie ebooka
        </DialogTitle>
        <DialogContent>
          <Grid item container justifyContent="center">
            <Grid item xs={8} container justifyContent="center" rowGap={3}>
              <BasicTextField
                label=""
                value={descripton}
                settings={{
                  placeholder: "Uzasadnienie",
                  multiline: true,
                  rows: 8,
                  inputProps: {
                    maxLength: 255,
                  },
                }}
                disableSpaceBetween={true}
                fullWidth={true}
                formSize={12}
                errorMessage={descriptionError}
                handleChange={(value: string) => {
                  setDescription(value);
                  setDescriptionError("");
                }}
              />
              <Button
                variant="contained"
                onClick={handleReport}
                style={{ width: "50%" }}
              >
                Zgłoś
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default ReportEbook;
