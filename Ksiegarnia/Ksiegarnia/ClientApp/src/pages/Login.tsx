import React from "react";
import CategoriesContent from "../layouts/CategoriesContent";
import FormService from "../services/FormService";
import { Button, Grid, TextField, Typography } from "@mui/material";
import BasicTextField from "../components/BasicTextField";
import Notification from "../components/Notification";
import UserService from "../services/UserService";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {

  const LOGGED_SUCCESSFULY_MESSAGE = "Zalogowano pomyślnie"
  const LOGGED_FAILED_MESSAGE = "Nie istnieje konto o takim adresie e-mail i/lub haśle"

  const initForm: LoginForm = {
    email: "",
    password: "",
  };

  const [form, setForm] = React.useState<LoginForm>({...initForm});

  const [errors, setErrors] = React.useState<LoginForm>({...initForm});

  const [showNotification, setShowNotification] = React.useState<boolean>(false)
  const [isSuccessNotification, setIsSuccessNotification] = React.useState<boolean>(true)
  const [notificationMessage, setShowNotificationMessage] = React.useState<string>("")

  const validateForm = () => {
    let newErrors: LoginForm = {...initForm};

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

    setErrors(newErrors)

    return passedValidation;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }

    UserService.login(form)
    .then((response) => {
      console.log(response)
      setShowNotification(true)
      setIsSuccessNotification(true)
      setShowNotificationMessage(LOGGED_SUCCESSFULY_MESSAGE)
    })
    .catch((error) => {
      console.log(error)
      setShowNotification(true)
      setIsSuccessNotification(false)
      setShowNotificationMessage(LOGGED_FAILED_MESSAGE)
    })
  };

  return (
    <CategoriesContent>
      <Grid item container justifyContent="center" rowGap={8} marginTop={4}>
        <Grid item xs={12}>
            <Typography variant="h4" textAlign="center">Logowanie</Typography>
        </Grid>
        <Grid item xs={3} container direction="column" alignItems="center" rowGap={6}>
          <BasicTextField
            label="E-mail"
            value={form.email}
            errorMessage={errors.email}
            handleChange={(value: string) => {
                setForm({ ...form, email: value})
                setErrors({...errors, email: ""})
            }}
          />
          <BasicTextField
            settings={{ type: "password" }}
            label="Hasło"
            value={form.password}
            errorMessage={errors.password}
            handleChange={(value: string) => {
              setForm({ ...form, password: value})
              setErrors({...errors, password: ""})
            }}
          />
          <Button variant="contained" style={{width: "50%"}} onClick={handleLogin}>
            Zaloguj się
          </Button>
        </Grid>
      </Grid>
      <Notification open={showNotification} isSuccess={isSuccessNotification} message={notificationMessage}/>
    </CategoriesContent>
  );
};

export default Login;
