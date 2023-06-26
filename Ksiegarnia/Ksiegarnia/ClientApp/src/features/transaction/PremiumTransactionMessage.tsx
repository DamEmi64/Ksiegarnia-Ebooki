import { CheckCircle, Error } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const PremiumTransactionMessage = (props: {succeeded: boolean}) => {
  const userContext = useContext(UserContext);

  const SUCCESFUL_MESSAGE =
    "Transakcja zakończyła się pomyślnie - zakupiono premium";
  const FAILED_MESSAGE = "Wystąpił błąd podczas finalizowania transakcji";

  React.useEffect(() => {
    if (props.succeeded) {
      userContext?.setIsPremium(true);
    }
  }, []);

  return (
    <Grid
      item
      container
      alignSelf="center"
      justifyContent="center"
      alignItems="center"
    >
      {!props.succeeded ? (
        <Error fontSize="large" style={{ color: "#EB4B36" }} />
      ) : (
        <CheckCircle className="success" fontSize="large" />
      )}
      <Typography variant="h4" marginLeft={2}>
        {props.succeeded ? SUCCESFUL_MESSAGE : FAILED_MESSAGE}
      </Typography>
    </Grid>
  );
};

export default PremiumTransactionMessage;
