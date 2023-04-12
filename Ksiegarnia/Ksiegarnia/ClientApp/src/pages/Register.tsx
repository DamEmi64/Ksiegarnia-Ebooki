import React from "react";
import CategoriesContent from "../layouts/CategoriesContent";
import FormService from "../services/FormService";
import { Button, Grid, TextField, Typography } from "@mui/material";
import BasicTextField from "../components/BasicTextField";
import Notification from "../components/Notification";
import UserService, { RegisterRequest } from "../services/UserService";

interface RegisterForm {
  firstName?: string;
  lastName?: string;
  email: string;
  nick: string;
  password: string;
  repeatedPassword: string;
  phone?: string;
}

const Register = () => {

  const REGISTERED_SUCCESSFULY_MESSAGE = "Zarejestrowano pomyślnie"
  const REGISTERED_FAILED_MESSAGE = "Nie udało się zarejestrować"

  const initForm = {
    email: "",
    nick: "",
    password: "",
    repeatedPassword: "",
  };

  const [form, setForm] = React.useState<RegisterForm>({ ...initForm });

  const [errors, setErrors] = React.useState<RegisterForm>({ ...initForm });

  const [showNotification, setShowNotification] = React.useState<boolean>(false)
  const [isSuccessNotification, setIsSuccessNotification] = React.useState<boolean>(true)
  const [notificationMessage, setShowNotificationMessage] = React.useState<string>("")

  const validateForm = () => {
    let newErrors: RegisterForm = { ...initForm };

    let passedValidation = true;

    if (!FormService.checkIfIsRequired(form.email)) {
      passedValidation = false;
      newErrors.email = FormService.requiredMessage;
    } else if (!FormService.checkIfIsEmail(form.email)) {
      passedValidation = false;
      newErrors.email = FormService.invalidFormatMessage;
    }

    if (!FormService.checkIfIsRequired(form.nick)) {
      passedValidation = false;
      newErrors.nick = FormService.requiredMessage;
    }

    if (!FormService.checkIfIsRequired(form.password)) {
      passedValidation = false;
      newErrors.password = FormService.requiredMessage;
    }

    if (!FormService.checkIfIsRequired(form.repeatedPassword)) {
      passedValidation = false;
      newErrors.repeatedPassword = FormService.requiredMessage;
    } else if (form.repeatedPassword !== form.password) {
      passedValidation = false;
      newErrors.repeatedPassword = "Hasła nie są takie same";
      newErrors.password = "Hasła nie są takie same";
    }

    setErrors(newErrors);

    return passedValidation;
  };

  const handleRegister = () => {
    if (!validateForm()) {
      return;
    }

    UserService.register(form)
    .then((response) => {
      console.log(response)
      setShowNotification(true)
      setIsSuccessNotification(true)
      setShowNotificationMessage(REGISTERED_SUCCESSFULY_MESSAGE)
      setErrors(initForm)
    })
    .catch((error) => {
      console.log(error)
      setShowNotification(true)
      setIsSuccessNotification(false)
      setShowNotificationMessage(REGISTERED_FAILED_MESSAGE)
    })
  };

  return (
    <CategoriesContent>
      <Grid item container justifyContent="center" rowGap={10} marginTop={4}>
        <Grid item xs={12}>
          <Typography variant="h4" textAlign="center">
            Rejestracja
          </Typography>
        </Grid>
        <Grid item container direction="column" alignItems="center" rowGap={6}>
          <Grid item container justifyContent="center" columnGap={12}>
            <Grid item xs={4}>
              <BasicTextField
                label="Imię"
                value={form.firstName}
                errorMessage={errors.firstName}
                handleChange={(value: string) => {
                  setForm({ ...form, firstName: value });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <BasicTextField
                label="Nazwisko"
                value={form.lastName}
                errorMessage={errors.lastName}
                handleChange={(value: string) => {
                  setForm({ ...form, lastName: value });
                }}
              />
            </Grid>
          </Grid>
          <Grid item container justifyContent="center" columnGap={12}>
            <Grid item xs={4}>
              <BasicTextField
                label="E-mail"
                isRequired={true}
                value={form.email}
                errorMessage={errors.email}
                handleChange={(value: string) => {
                  setForm({ ...form, email: value });
                  setErrors({ ...errors, email: "" });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <BasicTextField
                label="Pseudonim"
                isRequired={true}
                value={form.nick}
                errorMessage={errors.nick}
                handleChange={(value: string) => {
                  setForm({ ...form, nick: value });
                  setErrors({ ...errors, nick: "" });
                }}
              />
            </Grid>
          </Grid>
          <Grid item container justifyContent="center" columnGap={12}>
            <Grid item xs={4}>
              <BasicTextField
                settings={{ type: "password" }}
                label="Hasło"
                isRequired={true}
                value={form.password}
                errorMessage={errors.password}
                handleChange={(value: string) => {
                  setForm({ ...form, password: value });
                  setErrors({ ...errors, password: "" });
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <BasicTextField
                settings={{ type: "password" }}
                label="Powtórz hasło"
                isRequired={true}
                value={form.repeatedPassword}
                errorMessage={errors.repeatedPassword}
                handleChange={(value: string) => {
                  setForm({ ...form, repeatedPassword: value });
                  setErrors({ ...errors, repeatedPassword: "" });
                }}
              />
            </Grid>
          </Grid>
          <Grid item container justifyContent="center" columnGap={12}>
            <Grid item xs={4}>
              <BasicTextField
                settings={{ type: "number", maxRows: 9, minRows: 9 }}
                label="Numer tel."
                value={form.phone}
                errorMessage={errors.phone}
                handleChange={(value: string) => {
                  setForm({ ...form, phone: value });
                }}
              />
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
          <Button
            variant="contained"
            style={{ width: "16%" }}
            onClick={handleRegister}
          >
            Zarejestruj się
          </Button>
        </Grid>
      </Grid>
      <Notification open={showNotification} isSuccess={isSuccessNotification} message={notificationMessage}/>
    </CategoriesContent>
  );
};

export default Register;
