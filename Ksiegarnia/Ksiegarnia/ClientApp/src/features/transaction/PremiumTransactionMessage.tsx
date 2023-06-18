import { CheckCircle, Error } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import TransactionContext, {
  DistinctionDetails,
} from "../../context/TransactionContext";
import { UserContext } from "../../context/UserContext";
import Loading from "../../pages/Loading";
import EbookService from "../../services/EbookService";
import TransactionService from "../../services/TransactionService";
import PremiumService from "../../services/PremiumService";
import PremiumCheck from "../../models/api/premiumCheck";

const PremiumTransactionMessage = () => {
  const userContext = useContext(UserContext);
  const userId = userContext?.user.data?.id;

  const [searchParams] = useSearchParams();

  const transactionId = useParams().transactionId;
  const succeededFromPaypal = searchParams.get("succeeded");

  const [isFinalized, setIsFinalized] = React.useState<boolean>(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const SUCCESFUL_MESSAGE =
    "Transakcja zakończyła się pomyślnie - zakupiono premium";
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

    PremiumService.finishPremiumTransaction(
      transactionId as string,
      succeededFromPaypal === "true"
    )
      .then((response) => {
        console.log(response)
        userContext?.setIsPremium(true);

        setIsFinalized(true);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.log(error);
        setIsFinalized(true);
        setIsSuccess(false);
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

export default PremiumTransactionMessage;
