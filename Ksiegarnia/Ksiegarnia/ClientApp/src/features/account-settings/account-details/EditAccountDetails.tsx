import { Grid, Button, Typography } from "@mui/material";
import UserDTO from "../../../models/api/userDTO";
import React, { useContext } from "react";
import BasicTextField from "../../../components/BasicTextField";
import Notification from "../../../components/Notification";
import FormService from "../../../services/FormService";
import UserService from "../../../services/UserService";
import { UserContext } from "../../../context/UserContext";
import Loading from "../../../pages/Loading";
import { NotificationContext } from "../../../context/NotificationContext";
import axios from "axios";
import { AxiosError } from "axios";
import { AxiosResponse } from "axios";

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
  const FAILED_CHANGED_DATA_MESSAGE = "Nie udało się zapisać danych";

  const notificationContext = useContext(NotificationContext);
  const userContext = useContext(UserContext);
  const user = userContext?.user.data;

  if (!user) {
    return <Loading />;
  }

  const [form, setForm] = React.useState<FormProps>({
    ...user,
    previousPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = React.useState<FormProps>(initErrors);

  const validateForm = () => {
    let newErrors: FormProps = { ...initErrors };

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
      }
    }

    setErrors(newErrors);

    return passedValidation;
  };

  const handleEdit = () => {
    if (!validateForm()) {
      return;
    }

    const updateEmail = (): Promise<AxiosResponse<any, any>> => {
      return UserService.getEmailUpdateToken(user.id, form.email)
        .then((response) => {
          const token: string = response.data;

          return UserService.updateEmail(user.id, token, form.email)

          .catch((error) => {
            throw error
          });
        })
    };

    axios
    .all([
      form.previousPassword
        ? UserService.updatePassword(
            user.id,
            form.previousPassword,
            form.newPassword
          )
        : undefined,
      form.email !== user.email ? updateEmail() : undefined,
      UserService.update(user.id, form),
    ])
    .then((response) => {
      console.log("A")
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
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: false,
        message: FAILED_CHANGED_DATA_MESSAGE,
      });
    });
  };

  return (
    <Grid item container direction="column" alignItems="center" rowGap={6}>
      <Grid item container justifyContent="center" columnGap={12}>
        <Grid item xs={4}>
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
        <Grid item xs={4}>
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
            label="Poprzednie hasło"
            value={form.previousPassword}
            errorMessage={errors.previousPassword}
            handleChange={(value: string) => {
              setForm({ ...form, previousPassword: value });
              setErrors({ ...errors, previousPassword: "" });
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <BasicTextField
            settings={{ type: "password" }}
            label="Nowe hasło"
            value={form.newPassword}
            errorMessage={errors.newPassword}
            handleChange={(value: string) => {
              setForm({ ...form, newPassword: value });
              setErrors({ ...errors, newPassword: "" });
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
      <Grid item container direction="column" alignItems="center" rowGap={2}>
        <Button
          variant="contained"
          style={{ width: "16%" }}
          onClick={handleEdit}
        >
          Zapisz
        </Button>
        <Button
          variant="contained"
          style={{ width: "16%" }}
          onClick={() => props.setIsEditMode(false)}
        >
          Anuluj
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditAccountDetails;
