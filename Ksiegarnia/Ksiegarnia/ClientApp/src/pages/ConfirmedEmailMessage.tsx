import React from "react";
import UserService from "../services/UserService";
import { useSearchParams } from "react-router-dom";
import Loading from "./Loading";
import { CheckCircle, Error } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";

const ConfirmedEmailMessage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = searchParams.get("id");
  const token = searchParams.get("token");

  console.log(userId, token)

  const [isFinalized, setIsFinalized] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const SUCCESSFUL_MESSAGE = "Konto zostało potwierdzone";
  const FAILED_MESSAGE = "Wystąpił błąd podczas potwierdzania konta";

  React.useEffect(() => {
    UserService.confirmEmail(userId as string, token as string)
      .then((response) => {
        setIsSuccess(true);
        setIsFinalized(true);
      })
      .catch(() => {
        setIsSuccess(false);
        setIsFinalized(true);
      });
  }, []);

  if (!isFinalized) {
    return <Loading />;
  }

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
