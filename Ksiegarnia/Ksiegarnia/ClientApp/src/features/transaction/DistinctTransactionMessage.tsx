import React, { useContext } from "react";
import Loading from "../../pages/Loading";
import { CheckCircle, Error } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import EbookService from "../../services/EbookService";
import {
  DistinctionDetails,
  TransactionContext,
} from "../../context/TransactionContext";

const DistinctTransactionMessage = (props: { succeeded: boolean }) => {

  const [succeeded, setSucceeded] = React.useState<boolean>(props.succeeded);

  const transactionContext = useContext(TransactionContext);

  const [isFinalized, setIsFinalized] = React.useState<boolean>(false);

  const SUCCESFUL_MESSAGE =
    "Transakcja zakończyła się pomyślnie - wyróżniono ebooka";
  const FAILED_MESSAGE = "Wystąpił błąd podczas finalizowania transakcji";

  React.useEffect(() => {
    if (!succeeded) {
      setIsFinalized(true);
      return;
    }

    const distinctionDetails: DistinctionDetails = transactionContext
      ?.transaction.distinctionDetails as DistinctionDetails;

    console.log(distinctionDetails);

    EbookService.distinct(distinctionDetails.ebookId, distinctionDetails)
      .then(() => {
        transactionContext?.clearDistinctionDetails();
        setIsFinalized(true);
      })
      .catch((error) => {
        console.log(error);
        setSucceeded(false);
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
      {!succeeded ? (
        <Error fontSize="large" style={{ color: "#EB4B36" }} />
      ) : (
        <CheckCircle className="success" fontSize="large" />
      )}
      <Typography variant="h4" marginLeft={2}>
        {succeeded ? SUCCESFUL_MESSAGE : FAILED_MESSAGE}
      </Typography>
    </Grid>
  );
};

export default DistinctTransactionMessage;
