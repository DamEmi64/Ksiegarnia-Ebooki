import { Grid, Button } from "@mui/material";
import React, { useContext, useState } from "react";
import BasicTextField from "../../../components/BasicTextField";
import FormService from "../../../services/FormService";
import UserService from "../../../services/UserService";
import { UserContext } from "../../../context/UserContext";
import Loading from "../../../pages/Loading";
import { NotificationContext } from "../../../context/NotificationContext";
import axios from "axios";
import { AxiosResponse } from "axios";
import SaveEmail from "./SaveEmail";
import { Save } from "@mui/icons-material";

interface FormProps {
  firstName?: string;
  lastName?: string;
  email: string;
  nick: string;
  previousPassword: string;
  newPassword: string;
  phone?: string;
}

const initErrors: FormProps = {
  email: "",
  nick: "",
  previousPassword: "",
  newPassword: "",
};

const EditAccountDetails = (props: {
  setIsEditMode: (isEditMode: boolean) => void;
}) => {
  const SUCCESSFULY_CHANGED_DATA_MESSAGE = "Zapisano dane";
  const TOO_FREQUENTLY_PASSWORD_CHANGE = "Zbyt częsta zmiana hasła";
  const INVALID_PASSWORD_MESSAGE = "Wprowadzono niepoprawne hasło";
  const FAILED_CHANGED_DATA_MESSAGE = "Nie udało się zapisać danych";

  const notificationContext = useContext(NotificationContext);
  const userContext = useContext(UserContext);
  const user = userContext?.user.data;

  const [openSaveEmail, setOpenSaveEmail] = useState<boolean>(false)

  const [form, setForm] = React.useState<FormProps>({
    ...user!,
    previousPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = React.useState<FormProps>(initErrors);

  if (!user) {
    return <Loading />;
  }

  const validateForm = () => {
    const newErrors: FormProps = { ...initErrors };

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

    if (FormService.checkIfIsRequired(form.previousPassword)) {
      if (!FormService.checkIfIsRequired(form.newPassword)) {
        passedValidation = false;
        newErrors.newPassword = FormService.requiredMessage;
      } else if (!FormService.checkPassword(form.newPassword)) {
        passedValidation = false;
        newErrors.newPassword = FormService.invalidFormatMessage;
      }
    }

    setErrors(newErrors);

    return passedValidation;
  };

  const handleEdit = () => {
    if (!validateForm()) {
      return;
    }

    if(form.email !== user.email){
      setOpenSaveEmail(true)
      UserService.getEmailUpdateToken(user!.email);
      return;
    }

    axios
      .all([
        form.previousPassword
          ? UserService.updatePassword(
              user.id,
              form.previousPassword,
              form.newPassword
            )
          : undefined,
        UserService.update(user.id, form),
      ])
      .then((response) => {
        console.log(response);
        userContext.setUser({ ...user, ...form });
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: true,
          message: SUCCESSFULY_CHANGED_DATA_MESSAGE,
        });
        setErrors(initErrors);
        props.setIsEditMode(false);
      })
      .catch((error) => {
        console.log(error);
        const errorDescription = error.response.data.description;

        if (!errorDescription) {
          notificationContext?.setNotification({
            isVisible: true,
            isSuccessful: false,
            message: FAILED_CHANGED_DATA_MESSAGE,
          });
          return;
        }

        if (errorDescription.includes("Incorrect password")) {
          notificationContext?.setNotification({
            isVisible: true,
            isSuccessful: false,
            message: INVALID_PASSWORD_MESSAGE,
          });
        } else if (
          errorDescription.includes("Optimistic concurrency failure")
        ) {
          notificationContext?.setNotification({
            isVisible: true,
            isSuccessful: false,
            message: TOO_FREQUENTLY_PASSWORD_CHANGE,
          });
        }
      });
  };

  return (
    <Grid
      item
      container
      justifyContent={{
        xs: "center",
        lg: "space-between",
      }}
      rowGap={6}
    >
      <Grid item xs={12} md={8} lg={5.5}>
        <BasicTextField
          label="Imię"
          value={form.firstName}
          errorMessage={errors.firstName}
          handleChange={(value: string) => {
            setForm({ ...form, firstName: value });
            setErrors({ ...errors, firstName: "" });
          }}
        />
      </Grid>
      <Grid item xs={12} md={8} lg={5.5}>
        <BasicTextField
          label="Nazwisko"
          value={form.lastName}
          errorMessage={errors.lastName}
          handleChange={(value: string) => {
            setForm({ ...form, lastName: value });
            setErrors({ ...errors, lastName: "" });
          }}
        />
      </Grid>
      <Grid item xs={12} md={8} lg={5.5}>
        <BasicTextField
          label="E-mail"
          value={form.email}
          errorMessage={errors.email}
          handleChange={(value: string) => {
            setForm({ ...form, email: value });
            setErrors({ ...errors, email: "" });
          }}
        />
        <SaveEmail open={openSaveEmail} setOpen={setOpenSaveEmail} newEmail={form.email}/>
      </Grid>
      <Grid item xs={12} md={8} lg={5.5}>
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
      <Grid item xs={12} md={8} lg={5.5}>
        <BasicTextField
          settings={{ type: "password" }}
          label="Aktualne hasło"
          value={form.previousPassword}
          errorMessage={errors.previousPassword}
          handleChange={(value: string) => {
            setForm({ ...form, previousPassword: value });
            setErrors({ ...errors, previousPassword: "" });
          }}
        />
      </Grid>
      <Grid item xs={12} md={8} lg={5.5}>
        <BasicTextField
          settings={{
            type: "password",
            title: FormService.passwordFormatMessage,
          }}
          label="Nowe hasło"
          value={form.newPassword}
          errorMessage={errors.newPassword}
          handleChange={(value: string) => {
            setForm({ ...form, newPassword: value });
            setErrors({ ...errors, newPassword: "" });
          }}
        />
      </Grid>
      <Grid item xs={12} md={8} lg={5.5}>
        <BasicTextField
          settings={{ type: "number", placeholder: "123 456 789" }}
          label="Numer tel."
          value={form.phone}
          errorMessage={errors.phone}
          handleChange={(value: string) => {
            setForm({ ...form, phone: value });
          }}
        />
      </Grid>
      <Grid item xs={12} md={8} lg={5.5}></Grid>
      <Grid item container direction="column" alignItems="center" rowGap={2}>
        <Button
          variant="contained"
          style={{ padding: "6px 60px" }}
          onClick={handleEdit}
        >
          Zapisz
        </Button>
        <Button
          variant="contained"
          style={{ padding: "6px 60px" }}
          onClick={() => props.setIsEditMode(false)}
        >
          Anuluj
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditAccountDetails;
