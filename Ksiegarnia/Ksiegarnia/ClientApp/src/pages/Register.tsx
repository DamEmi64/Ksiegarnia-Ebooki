import React from "react";
import CategoriesContent from "../layouts/CategoriesContent";
import FormService from "../services/FormService";
import { Button, Grid, TextField, Typography } from "@mui/material";
import BasicTextField from "../components/BasicTextField";

interface RegisterForm {
  firstName?: string;
  lastName?: string;
  email: string;
  nick: string;
  password: string;
  repeatedPassword: string;
  phoneNumber?: string;
}

const Register = () => {
  const initForm = {
    email: "",
    nick: "",
    password: "",
    repeatedPassword: "",
  };

  const [form, setForm] = React.useState<RegisterForm>({ ...initForm });

  const [errors, setErrors] = React.useState<RegisterForm>({ ...initForm });

  const validateForm = () => {
    let newErrors: RegisterForm = { ...initForm };

    let failedValidation = false;

    if (!FormService.checkIfIsRequired(form.email)) {
      failedValidation = true;
      newErrors.email = FormService.requiredMessage;
    } else if (!FormService.checkIfIsEmail(form.email)) {
      failedValidation = true;
      newErrors.email = FormService.invalidFormatMessage;
    }

    if (!FormService.checkIfIsRequired(form.nick)) {
      failedValidation = true;
      newErrors.nick = FormService.requiredMessage;
    }

    if (!FormService.checkIfIsRequired(form.password)) {
      failedValidation = true;
      newErrors.password = FormService.requiredMessage;
    }

    if (!FormService.checkIfIsRequired(form.repeatedPassword)) {
      failedValidation = true;
      newErrors.nick = FormService.requiredMessage;
    } else if (form.repeatedPassword !== form.password) {
      failedValidation = true;
      newErrors.repeatedPassword = "Hasła nie są takie same";
    }

    setErrors(newErrors);

    return failedValidation;
  };

  const handleRegister = () => {
    if (!validateForm()) {
      return;
    }

    console.log(form);
    console.log(errors);
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
                value={form.phoneNumber}
                errorMessage={errors.phoneNumber}
                handleChange={(value: string) => {
                  setForm({ ...form, phoneNumber: value });
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
    </CategoriesContent>
  );
};

export default Register;
