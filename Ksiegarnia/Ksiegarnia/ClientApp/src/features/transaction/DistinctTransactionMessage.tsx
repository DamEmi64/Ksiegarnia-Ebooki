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
import { UserContext } from "../../context/UserContext";
import Statistics from "../../models/api/statistics";
import Ebook from "../../models/api/ebook";
import Transaction from "../../models/api/transaction";
import EbookService from "../../services/EbookService";
import {
  DistinctionDetails,
  TransactionContext,
} from "../../context/TransactionContext";

const DistinctTransactionMessage = () => {
  const userContext = useContext(UserContext);
  const userId = userContext?.user.data?.id;

  const [searchParams] = useSearchParams();

  const transactionId = useParams().transactionId;
  const succeededFromPaypal = searchParams.get("succeeded");
  const paymentId = searchParams.get("paymentId");
  const token = searchParams.get("token");
  const payerId = searchParams.get("PayerID");

  const transactionContext = useContext(TransactionContext);

  const [isFinalized, setIsFinalized] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const SUCCESFUL_MESSAGE =
    "Transakcja zakończyła się pomyślnie - wyróżniono ebooka";
  const FAILED_MESSAGE = "Wystąpił błąd podczas finalizowania transakcji";

  React.useEffect(() => {
    if (!transactionId || succeededFromPaypal == null) {
      navigate("/not-found");
    }

    if (!succeededFromPaypal) {
      setIsFinalized(true);
      setIsSuccess(false);
      return;
    }

    TransactionService.finishDistinctTransaction(
      transactionId as string,
      succeededFromPaypal === "true",
      paymentId as string,
      token as string,
      payerId as string
    )
      .then((response) => {
        console.log(response);

        const distinctionDetails: DistinctionDetails = transactionContext
          ?.transaction.distinctionDetails as DistinctionDetails;

        console.log(distinctionDetails)

        EbookService.distinct(distinctionDetails.ebookId, distinctionDetails)
          .then(() => {
            setIsFinalized(true);
            setIsSuccess(true);
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        console.log(error);
        setIsFinalized(true);
        setIsSuccess(false);
      });
  }, []);

  if (!isFinalized || !userContext) {
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

export default DistinctTransactionMessage;
