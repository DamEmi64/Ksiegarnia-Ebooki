import React, { useContext } from "react";
import TransactionService from "../../services/TransactionService";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { NotificationContext } from "../../context/NotificationContext";
import Loading from "../../pages/Loading";
import { CheckCircle, Error, Warning } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";

const TransactionMessage = () => {
  const [searchParams] = useSearchParams();

  const transactionId = useParams().transactionId;
  const succeededFromPaypal = searchParams.get("succeeded");

  const [isFinalized, setIsFinalized] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const notificationContext = useContext(NotificationContext);

  const navigate = useNavigate();

  const SUCCESFUL_MESSAGE = "Transakcja zakończyła się pomyślnie";
  const FAILED_MESSAGE = "Wystąpił błąd podczas finalizowania transakcji";

  React.useEffect(() => {
    if (!transactionId || succeededFromPaypal == null) {
      navigate("/not-found");
    }

    if (!succeededFromPaypal) {
      setIsFinalized(true);
      setIsSuccess(false)
      return;
    }

    TransactionService.finishTransaction(
      transactionId as string,
      succeededFromPaypal === "true"
    )
      .then((response) => {
        console.log(response);
        setIsFinalized(true);
        setIsSuccess(true)
      })
      .catch((error) => {
        console.log(error);
        setIsFinalized(true);
        setIsSuccess(false)
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
        {isSuccess ? SUCCESFUL_MESSAGE : FAILED_MESSAGE}
      </Typography>
    </Grid>
  );
};

export default TransactionMessage;
