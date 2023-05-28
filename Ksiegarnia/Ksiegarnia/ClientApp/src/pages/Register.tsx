import React, { useContext } from "react";
import FormService from "../services/FormService";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import BasicTextField from "../components/BasicTextField";
import UserService, { RegisterProps } from "../services/UserService";
import { NotificationContext } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import CustomDatePicker from "../components/CustomDatePicker";
import { CheckBox } from "@mui/icons-material";
import AcceptRegulamin from "../features/register/AcceptRegulamin";

interface RegisterForm {
  firstName?: string;
  lastName?: string;
  email: string;
  nick: string;
  password: string;
  repeatedPassword: string;
  birthDate: Date;
  phone?: string;
  acceptedRegulamin: boolean;
}

interface ErrorsForm {
  email: string;
  nick: string;
  password: string;
  repeatedPassword: string;
  birthDate: string;
  acceptedRegulamin: string;
}

const Register = () => {
  const notificationContext = useContext(NotificationContext);

  const REGISTERED_SUCCESSFULY_MESSAGE = "Zarejestrowano pomyślnie";
  const REGISTERED_FAILED_MESSAGE = "Istnieje już konto o takim adresie e-mail";

  const initForm: RegisterForm = {
    email: "",
    nick: "",
    password: "",
    repeatedPassword: "",
    birthDate: new Date(),
    acceptedRegulamin: false,
  };

  const errorsInitForm: ErrorsForm = {
    email: "",
    nick: "",
    password: "",
    repeatedPassword: "",
    birthDate: "",
    acceptedRegulamin: "",
  };

  const [form, setForm] = React.useState<RegisterForm>({ ...initForm });

  const [errors, setErrors] = React.useState<ErrorsForm>({ ...errorsInitForm });

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: ErrorsForm = { ...errorsInitForm };

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
    } else if (!FormService.checkPassword(form.password)) {
      passedValidation = false;
      newErrors.password = FormService.invalidFormatMessage;
    }

    if (!FormService.checkIfIsRequired(form.repeatedPassword)) {
      passedValidation = false;
      newErrors.repeatedPassword = FormService.requiredMessage;
    } else if (form.repeatedPassword !== form.password) {
      passedValidation = false;
      newErrors.repeatedPassword = "Hasła nie są takie same";
      newErrors.password = "Hasła nie są takie same";
    }

    if (!FormService.checkIfIsAdult(new Date(form.birthDate))) {
      passedValidation = false;
      newErrors.birthDate = "Wymagane jest 18 lat";
    }

    if (!form.acceptedRegulamin) {
      passedValidation = false;
      newErrors.acceptedRegulamin = FormService.requiredMessage;
    }

    setErrors(newErrors);

    return passedValidation;
  };

  const handleRegister = () => {
    if (!validateForm()) {
      return;
    }

    const request: RegisterProps = {
      ...form,
      birthDate: form.birthDate.toISOString(),
    };

    console.log(request);

    UserService.register(request)
      .then((response) => {
        console.log(response);
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: true,
          message: REGISTERED_SUCCESSFULY_MESSAGE,
        });
        setErrors(errorsInitForm);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: false,
          message: REGISTERED_FAILED_MESSAGE,
        });
      });
  };

  return (
    <Grid item container justifyContent="center" rowGap={8} marginTop={2}>
      <Grid item xs={12}>
        <Typography variant="h4" textAlign="center">
          Rejestracja
        </Typography>
      </Grid>
      <Grid
        item
        xs={10}
        md={8}
        lg={6}
        container
        justifyContent={{
          xs: "center",
          lg: "space-between",
        }}
        rowGap={4}
      >
        <Grid item xs={12} md={8} lg={5.5}>
          <BasicTextField
            label="Imię"
            value={form.firstName}
            handleChange={(value: string) => {
              setForm({ ...form, firstName: value });
            }}
          />
        </Grid>
        <Grid item xs={12} md={8} lg={5.5}>
          <BasicTextField
            label="Nazwisko"
            value={form.lastName}
            handleChange={(value: string) => {
              setForm({ ...form, lastName: value });
            }}
          />
        </Grid>
        <Grid item xs={12} md={8} lg={5.5}>
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
        <Grid item xs={12} md={8} lg={5.5}>
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
        <Grid item xs={12} md={8} lg={5.5}>
          <BasicTextField
            settings={{
              type: "password",
              title: FormService.passwordFormatMessage,
            }}
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
        <Grid item xs={12} md={8} lg={5.5}>
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
        <Grid item xs={12} md={8} lg={5.5}>
          <BasicTextField
            settings={{ type: "number", placeholder: "123 456 789" }}
            label="Numer tel."
            value={form.phone}
            handleChange={(value: string) => {
              setForm({ ...form, phone: value });
            }}
          />
        </Grid>
        <Grid item xs={12} md={8} lg={5.5}>
          <CustomDatePicker
            label="Data urodzin"
            formSize={6}
            isRequired={true}
            value={form.birthDate}
            errorMessage={errors.birthDate}
            onChange={(newDate: Date) => {
              setForm({ ...form, birthDate: newDate });
            }}
          />
        </Grid>
        <Grid item xs={12} container justifyContent="center">
          <AcceptRegulamin
            value={form.acceptedRegulamin}
            errorMessage={errors.acceptedRegulamin}
            onChange={(newValue: boolean) =>
              setForm({ ...form, acceptedRegulamin: newValue })
            }
          />
        </Grid>
        <Grid item xs={12} container justifyContent="center" marginTop={-1}>
          <Button variant="contained" onClick={handleRegister}>
            Zarejestruj się
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Register;
