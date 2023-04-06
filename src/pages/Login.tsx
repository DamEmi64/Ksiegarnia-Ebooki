import React from "react";
import CategoriesContent from "../layouts/CategoriesContent";
import FormService from "../services/FormService";
import { Button, Grid, TextField, Typography } from "@mui/material";
import BasicTextField from "../components/BasicTextField";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const initForm: LoginForm = {
    email: "",
    password: "",
  };

  const [form, setForm] = React.useState<LoginForm>({...initForm});

  const [errors, setErrors] = React.useState<LoginForm>({...initForm});

  const validateForm = () => {
    let newErrors: LoginForm = {...initForm};

    let failedValidation = false;

    if (!FormService.checkIfIsRequired(form.email)) {
      failedValidation = true;
      newErrors.email = FormService.requiredMessage;
    } else if (!FormService.checkIfIsEmail(form.email)) {
      failedValidation = true;
      newErrors.email = FormService.invalidFormatMessage;
    }

    if (!FormService.checkIfIsRequired(form.password)) {
      failedValidation = true;
      newErrors.password = FormService.requiredMessage;
    }

    setErrors(newErrors)

    return failedValidation;
  };

  const handleLogin = () => {
    if (!validateForm()) {
      return;
    }

    console.log(form);
    console.log(errors)
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
    </CategoriesContent>
  );
};

export default Login;
