import React from "react";
import UserService from "../services/UserService";
import { useSearchParams } from "react-router-dom";
import Loading from "./Loading";
import { CheckCircle, Error } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";

const ConfirmedEmailMessage = () => {
  const [isSuccess, setIsSuccess] = React.useState<boolean>(true);

  const SUCCESSFUL_MESSAGE = "Konto zostało potwierdzone";
  const FAILED_MESSAGE = "Wystąpił błąd podczas potwierdzania konta";

  return (
    <Grid
      item
      container
      alignSelf="center"
      justifyContent="center"
      alignItems="center"
    >
      {!isSuccess ? (
        <Error fontSize="large" style={{ color: "#EB4B36" }} />
      ) : (
        <CheckCircle className="success" fontSize="large" />
      )}
      <Typography variant="h4" marginLeft={2}>
        {isSuccess ? SUCCESSFUL_MESSAGE : FAILED_MESSAGE}
      </Typography>
    </Grid>
  );
};

export default ConfirmedEmailMessage;
