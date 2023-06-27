import React, { useContext } from "react";
import TransactionService from "../../services/TransactionService";
import Loading from "../../pages/Loading";
import { CheckCircle, Error } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import Statistics from "../../models/api/statistics";
import Ebook from "../../models/api/ebook";
import Transaction from "../../models/api/transaction";

const EbookTransactionMessage = (props: {succeeded: boolean}) => {
  const userContext = useContext(UserContext);
  const userId = userContext?.user.data?.id;

  const [succeeded, setSucceeded] = React.useState<boolean>(props.succeeded)

  const [isFinalized, setIsFinalized] = React.useState<boolean>(false);

  const SUCCESFUL_MESSAGE = "Transakcja zakończyła się pomyślnie";
  const FAILED_MESSAGE = "Wystąpił błąd podczas finalizowania transakcji";

  React.useEffect(() => {
    if(!succeeded){
      setIsFinalized(true)
      return;
    }

    TransactionService.getUserStats(userId as string).then((response) => {
      const statistics: Statistics = response.data;

      const newBoughtEbooksIds: string[] = [];

      statistics.buyed_books.forEach((transaction: Transaction) => {
        newBoughtEbooksIds.push(
          ...transaction.books.map((ebook: Ebook) => ebook.id)
        );
      });

      setIsFinalized(true)

      userContext?.setBoughtEbooksIds(newBoughtEbooksIds);
    })
    .catch((error) => {
      console.log(error)
      setSucceeded(false)
    })
  }, [])

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

export default EbookTransactionMessage;
