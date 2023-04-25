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

interface FormProps {
  firstName?: string;
  lastName?: string;
  email: string;
  nick: string;
  password: string;
  repeatedPassword: string;
  phone?: string;
}

const initErrors: FormProps = {
  email: "",
  nick: "",
  password: "",
  repeatedPassword: "",
}

const EditAccountDetails = (props: {
  setIsEditMode: (isEditMode: boolean) => void;
}) => {
  const SUCCESSFULY_CHANGED_DATA_MESSAGE = "Zapisano dane";
  const FAILED_CHANGED_DATA_MESSAGE = "Nie udało się zapisać danych";

  const notificationContext = useContext(NotificationContext)
  const userContext = useContext(UserContext)
  const user = userContext?.user.data

  if(!user){
    return <Loading/> 
  }

  const [form, setForm] = React.useState<FormProps>({
    ...user,
    password: "",
    repeatedPassword: "",
  });

  const [errors, setErrors] = React.useState<FormProps>({
    email: "",
    nick: "",
    password: "",
    repeatedPassword: "",
  });
  
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

    if (FormService.checkIfIsRequired(form.password)) {

      if (!FormService.checkIfIsRequired(form.repeatedPassword)) {
        passedValidation = false;
        newErrors.repeatedPassword = FormService.requiredMessage;
      } 
      else if (form.repeatedPassword !== form.password) {
        passedValidation = false;
        newErrors.repeatedPassword = "Hasła nie są takie same";
        newErrors.password = "Hasła nie są takie same";
      }
    }

    setErrors(newErrors);

    return passedValidation;
  };

  const handleEdit = () => {

    if (!validateForm()) {
      return;
    }

    UserService.update(user.id, form)
    .then((response) => {
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: true,
        message: SUCCESSFULY_CHANGED_DATA_MESSAGE
      })
      userContext.setUser({...user, ...form})
      setErrors(initErrors)
      props.setIsEditMode(false)
    })
    .catch((error) => {
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: false,
        message: FAILED_CHANGED_DATA_MESSAGE
      })
    })
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
            value={form.phone}
            errorMessage={errors.phone}
            handleChange={(value: string) => {
              setForm({ ...form, phone: value });
            }}
          />
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
      <Grid
        item
        container
        direction="column"
        alignItems="center"
        rowGap={2}
      >
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
