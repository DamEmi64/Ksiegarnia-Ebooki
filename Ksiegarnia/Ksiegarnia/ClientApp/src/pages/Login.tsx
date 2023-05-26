import React, { useContext } from "react";
import FormService from "../services/FormService";
import { Button, Grid, Typography } from "@mui/material";
import BasicTextField from "../components/BasicTextField";
import UserService from "../services/UserService";
import { NotificationContext } from "../context/NotificationContext";
import { UserContext } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const userContext = React.useContext(UserContext);
  const notificationContext = useContext(NotificationContext);

  const LOGGED_SUCCESSFULY_MESSAGE = "Zalogowano pomyślnie";
  const LOGGED_FAILED_MESSAGE =
    "Nie istnieje konto o takim adresie e-mail i/lub haśle";

  const initForm: LoginForm = {
    email: "",
    password: "",
  };

  const [form, setForm] = React.useState<LoginForm>({ ...initForm });

  const [errors, setErrors] = React.useState<LoginForm>({ ...initForm });

  const redirectUrl = useLocation().state;
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: LoginForm = { ...initForm };

    let passedValidation = true;

    if (!FormService.checkIfIsRequired(form.email)) {
      passedValidation = false;
      newErrors.email = FormService.requiredMessage;
    } else if (!FormService.checkIfIsEmail(form.email)) {
      passedValidation = false;
      newErrors.email = FormService.invalidFormatMessage;
    }

    if (!FormService.checkIfIsRequired(form.password)) {
      passedValidation = false;
      newErrors.password = FormService.requiredMessage;
    }

    setErrors(newErrors);

    return passedValidation;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }

    UserService.login(form)
      .then((response) => {
        console.log(response);
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: true,
          message: LOGGED_SUCCESSFULY_MESSAGE,
        });
        userContext?.setAll({
          logged: true,
          data: response.data,
        });
        setErrors(initForm);
        navigate(redirectUrl);
      })
      .catch((error) => {
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: false,
          message: LOGGED_FAILED_MESSAGE,
        });
      });
  };

  return (
    <Grid item container justifyContent="center" alignContent="start" rowGap={8} marginTop={4}>
      <Grid item xs={12}>
        <Typography variant="h4" textAlign="center">
          Logowanie
        </Typography>
      </Grid>
      <Grid
        item
        xs={10}
        sm={8}
        md={6}
        lg={4}
        xl={3}
        container
        direction="column"
        alignItems="center"
        rowGap={6}
      >
        <BasicTextField
          label="E-mail"
          formSize={7}
          value={form.email}
          errorMessage={errors.email}
          handleChange={(value: string) => {
            setForm({ ...form, email: value });
            setErrors({ ...errors, email: "" });
          }}
        />
        <BasicTextField
          settings={{ type: "password" }}
          label="Hasło"
          formSize={7}
          value={form.password}
          errorMessage={errors.password}
          handleChange={(value: string) => {
            setForm({ ...form, password: value });
            setErrors({ ...errors, password: "" });
          }}
        />
        <Button
          variant="contained"
          style={{ width: "50%" }}
          onClick={handleLogin}
        >
          Zaloguj się
        </Button>
      </Grid>
    </Grid>
  );
};

export default Login;
