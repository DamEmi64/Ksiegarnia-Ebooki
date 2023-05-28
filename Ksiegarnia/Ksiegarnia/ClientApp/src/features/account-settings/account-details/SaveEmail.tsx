import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { NotificationContext } from "../../../context/NotificationContext";
import FormService from "../../../services/FormService";
import UserService from "../../../services/UserService";
import { UserContext } from "../../../context/UserContext";
import Loading from "../../../pages/Loading";
import BasicTextField from "../../../components/BasicTextField";

interface FormProps {
  token: string;
}

const initForm: FormProps = {
  token: "",
};

const SaveEmail = (props: {
  open: boolean;
  setOpen: (newValue: boolean) => void;
  newEmail: string;
}) => {
  const [form, setForm] = React.useState<FormProps>({ ...initForm });
  const [errors, setErrors] = React.useState<FormProps>({ ...initForm });

  const notificationContext = React.useContext(NotificationContext);
  const userContext = useContext(UserContext);
  const user = userContext?.user.data;

  const SUCCESSFUL_MESSAGE = "Zapisano e-mail";
  const FAILED_MESSAGE = "Wprowadzono niepoprawny token";

  if (!user) {
    return <Loading />;
  }

  const validateForm = () => {
    const newErrors: FormProps = { ...initForm };

    let passedValidation = true;

    if (!FormService.checkIfIsRequired(form.token)) {
      passedValidation = false;
      newErrors.token = FormService.requiredMessage;
    }

    setErrors(newErrors);

    return passedValidation;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    UserService.updateEmail(user.id, form.token, props.newEmail)
      .then((response) => {
        userContext.setUser({ ...user, email: props.newEmail });
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: true,
          message: SUCCESSFUL_MESSAGE,
        });
        setErrors(initForm);
        handleClose()
      })
      .catch((error) => {
        console.log(error);
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: false,
          message: FAILED_MESSAGE,
        });
      });
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={props.open}
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
        Zmiana adresu e-mail
      </DialogTitle>
      <DialogContent>
        <Grid item container justifyContent="center">
          <Grid item xs={8}>
            <Grid container justifyContent="center" rowGap={6}>
              <BasicTextField
                label="Token"
                value={form.token}
                errorMessage={errors.token}
                handleChange={(value: string) => {
                  setForm({ ...form, token: value });
                  setErrors({ ...errors, token: "" });
                }}
              />
              <Button
                variant="contained"
                onClick={handleSave}
                style={{ width: "50%" }}
              >
                Zapisz
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default SaveEmail;
