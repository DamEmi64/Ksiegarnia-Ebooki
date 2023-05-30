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

const InsertEmail = (props: {
  email: string;
  setEmail: (newEmail: string) => void;
  setNextState: () => void;
}) => {
  const [errors, setErrors] = React.useState<FormProps>({ ...initForm });

  const notificationContext = React.useContext(NotificationContext);

  const SUCCESSUL_MESSAGE = "Wysłano token na podany adres e-mail";

  const validateForm = () => {
    const newErrors: FormProps = { ...initForm };

    let passedValidation = true;

    if (!FormService.checkIfIsRequired(props.email)) {
      passedValidation = false;
      newErrors.email = FormService.requiredMessage;
    } else if (!FormService.checkIfIsEmail(props.email)) {
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

    UserService.getPasswordResetToken(props.email).then((response) => {
      props.setNextState();
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: true,
        message: SUCCESSUL_MESSAGE,
      });
    });
  };

  return (
    <Grid item container justifyContent="center" rowGap={6}>
      <BasicTextField
        label="E-mail"
        value={props.email}
        errorMessage={errors.email}
        handleChange={(value: string) => {
          props.setEmail(value)
          setErrors({ ...errors, email: "" });
        }}
      />
      <Button
        variant="contained"
        onClick={handleReset}
        style={{ width: "50%" }}
      >
        Zresetuj hasło
      </Button>
    </Grid>
  );
};

export default InsertEmail;
