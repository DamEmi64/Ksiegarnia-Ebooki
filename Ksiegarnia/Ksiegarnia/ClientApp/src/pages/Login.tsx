﻿import React, { useContext } from "react";
import FormService from "../services/FormService";
import { Button, Grid, Typography } from "@mui/material";
import BasicTextField from "../components/BasicTextField";
import UserService from "../services/UserService";
import { NotificationContext } from "../context/NotificationContext";
import { UserContext } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import ResetPassword from "../features/reset-password/ResetPassword";
import PremiumService from "../services/PremiumService";
import PremiumCheck from "../models/api/premiumCheck";
import UserDTO from "../models/api/userDTO";
import TransactionService from "../services/TransactionService";
import axios from "axios";
import Ebook from "../models/api/ebook";
import Statistics from "../models/api/statistics";
import { BasketContext } from "../context/BasketContext";
import Transaction from "../models/api/transaction";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const userContext = React.useContext(UserContext);
  const basketContext = React.useContext(BasketContext);
  const notificationContext = useContext(NotificationContext);

  const LOGGED_SUCCESSFULY_MESSAGE = "Zalogowano pomyślnie";
  const INVALID_DATA_MESSAGE = "Nie istnieje konto o takim adresie e-mail lub haśle";
  const NOT_CONFIRMED_MESSAGE = "Konto jest niepotwierdzone";

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
        const userData: UserDTO = response.data;
        console.log(response.data);

        axios
          .all([
            TransactionService.getUserStats(userData.id),
            PremiumService.checkPremium(userData.id),
          ])
          .then((responses) => {
            const userTransactionsStats: Statistics = responses[0].data;
            const premiumData: PremiumCheck = responses[1].data;

            const boughtEbooksIds: string[] = [];

            userTransactionsStats.buyed_books.forEach((transaction: Transaction) => {
              boughtEbooksIds.push(
                ...transaction.books.map((ebook: Ebook) => ebook.id)
              );
            });

            userContext?.setAll({
              logged: true,
              data: response.data,
              isPremium: premiumData.isActive,
              boughtEbooksIds: boughtEbooksIds,
              numberOfAddedEbooks: 0,
              numberOfDistinctions: 0
            });

            notificationContext?.setNotification({
              isVisible: true,
              isSuccessful: true,
              message: LOGGED_SUCCESSFULY_MESSAGE,
            });

            setErrors(initForm);
            navigate(redirectUrl);
          });
      })
      .catch((error) => {
        console.log(error)
        if(error.response.data.error.includes("not found")){
          notificationContext?.setNotification({
            isVisible: true,
            isSuccessful: false,
            message: INVALID_DATA_MESSAGE,
          });
        }
        else{
          notificationContext?.setNotification({
            isVisible: true,
            isSuccessful: false,
            message: NOT_CONFIRMED_MESSAGE,
          });
        }
      });
  };

  return (
    <Grid
      item
      container
      justifyContent="center"
      alignContent="start"
      rowGap={8}
      marginTop={4}
    >
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
        <Grid item container direction="column" alignItems="center" rowGap={2}>
          <Button
            variant="contained"
            style={{ width: "50%" }}
            onClick={handleLogin}
          >
            Zaloguj się
          </Button>
          <ResetPassword />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Login;
