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
  email: string;
}

const initForm: FormProps = {
  email: "",
};

const InsertEmail = (props: { setNextState: () => void }) => {
  const [form, setForm] = React.useState<FormProps>({ ...initForm });
  const [errors, setErrors] = React.useState<FormProps>({ ...initForm });

  const notificationContext = React.useContext(NotificationContext);

  const SUCCESSUL_MESSAGE = "Wysłano token na podany adres e-mail";

  const validateForm = () => {
    const newErrors: FormProps = { ...initForm };

    let passedValidation = true;

    if (!FormService.checkIfIsRequired(form.email)) {
      passedValidation = false;
      newErrors.email = FormService.requiredMessage;
    } else if (!FormService.checkIfIsEmail(form.email)) {
      passedValidation = false;
      newErrors.email = FormService.invalidFormatMessage;
    }

    setErrors(newErrors);

    return passedValidation;
  };

  const handleReset = () => {
    if (!validateForm()) {
      return;
    }

    notificationContext?.setNotification({
      isVisible: true,
      isSuccessful: true,
      message: SUCCESSUL_MESSAGE,
    });

    props.setNextState();

    /*UserService.getPasswordResetToken(form.email)
    .then((response) => {
        props.setNextState()
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: true,
        message: SUCCESSUL_MESSAGE,
      });
    });*/
  };

  return (
    <Grid item container justifyContent="center" rowGap={6}>
      <BasicTextField
        label="E-mail"
        value={form.email}
        errorMessage={errors.email}
        handleChange={(value: string) => {
          setForm({ ...form, email: value });
          setErrors({ ...errors, email: "" });
        }}
      />
      <Button variant="contained" onClick={handleReset} style={{width: "50%"}}>
        Zresetuj hasło
      </Button>
    </Grid>
  );
};

export default InsertEmail;
