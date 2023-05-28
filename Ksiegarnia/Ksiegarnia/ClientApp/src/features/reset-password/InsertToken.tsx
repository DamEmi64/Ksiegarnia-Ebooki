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

interface FormProps {
  token: string;
  newPassword: string;
}

const initForm: FormProps = {
  token: "",
  newPassword: "",
};

const InsertToken = (props: { email: string; handleClose: () => void }) => {
  const [form, setForm] = React.useState<FormProps>({ ...initForm });
  const [errors, setErrors] = React.useState<FormProps>({ ...initForm });

  const notificationContext = React.useContext(NotificationContext);

  const SUCCESSFUL_MESSAGE = "Ustawiono nowe hasło";
  const FAILED_MESSAGE = "Wprowadzono niepoprawny token";

  const validateForm = () => {
    const newErrors: FormProps = { ...initForm };

    let passedValidation = true;

    if (!FormService.checkIfIsRequired(form.token)) {
      passedValidation = false;
      newErrors.token = FormService.requiredMessage;
    }

    if (!FormService.checkIfIsRequired(form.newPassword)) {
      passedValidation = false;
      newErrors.newPassword = FormService.requiredMessage;
    } else if (!FormService.checkPassword(form.newPassword)) {
      passedValidation = false;
      newErrors.newPassword = FormService.invalidFormatMessage;
    }

    setErrors(newErrors);

    return passedValidation;
  };

  const handleReset = () => {
    if (!validateForm()) {
      return;
    }

    UserService.resetPassword(form.token, props.email, form.newPassword)
      .then((response) => {
        console.log(response);
        props.handleClose();
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

  return (
    <Grid container justifyContent="center" rowGap={3}>
      <BasicTextField
        label="Token"
        value={form.token}
        errorMessage={errors.token}
        handleChange={(value: string) => {
          setForm({ ...form, token: value });
          setErrors({ ...errors, token: "" });
        }}
      />
      <BasicTextField
        label="Nowe hasło"
        settings={{
          type: "password",
          title: FormService.passwordFormatMessage,
        }}
        value={form.newPassword}
        errorMessage={errors.newPassword}
        handleChange={(value: string) => {
          setForm({ ...form, newPassword: value });
          setErrors({ ...errors, newPassword: "" });
        }}
      />
      <Button
        variant="contained"
        onClick={handleReset}
        style={{ width: "50%", marginTop: 18 }}
      >
        Zapisz
      </Button>
    </Grid>
  );
};

export default InsertToken;
