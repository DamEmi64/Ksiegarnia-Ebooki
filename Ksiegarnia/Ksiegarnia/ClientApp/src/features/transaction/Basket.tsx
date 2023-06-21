import { Button, Grid, IconButton, Typography } from "@mui/material";
import Rate from "../../components/EbookRate";
import Ebook from "../../models/api/ebook";
import Image from "../../components/Image";
import React, { useContext } from "react";
import { BasketContext } from "../../context/BasketContext";
import { Delete } from "@mui/icons-material";
import { UserContext } from "../../context/UserContext";
import {
  RelativeRoutingType,
  useLocation,
  useNavigate,
} from "react-router-dom";
import TransactionService from "../../services/TransactionService";
import Loading from "../../pages/Loading";
import { NotificationContext } from "../../context/NotificationContext";
import axios, { AxiosResponse } from "axios";
import EbookService from "../../services/EbookService";
import EbookPrice from "../../components/EbookPrice";
import EbookImage from "../../components/EbookImage";
import Statistics from "../../models/api/statistics";
import Transaction from "../../models/api/transaction";
import HorizontalAd from "../../components/HorizontalAd";

const BasketEbookView = (props: { ebook: Ebook }) => {
  const ebook = props.ebook;

  const basketContext = useContext(BasketContext);

  return (
    <Grid
      item
      container
      padding={4}
      borderBottom="1px solid silver"
      justifyContent="space-between"
      alignItems="center"
      rowSpacing={4}
    >
      <Grid
        item
        xs={12}
        lg={9}
        md={8}
        container
        columnGap={3}
        justifyContent={{ xs: "center", sm: "start" }}
        rowGap={2}
      >
        <Grid
          item
          xs={5}
          lg={3}
          container
          justifyContent="center"
          height="195px"
        >
          <EbookImage
            alt={ebook.title}
            src={ebook.picture}
            style={{ maxWidth: "100%", width: "auto", height: "100%" }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          container
          direction="column"
          justifyContent="space-between"
        >
          <Grid item container direction="column" rowGap={1}>
            <Typography variant="h5" fontWeight="bold">
              {ebook.title}
            </Typography>
            <Typography variant="h6">
              {ebook.author.firstName + " " + ebook.author.lastName}
            </Typography>
          </Grid>
          <Grid item container direction="column" rowGap={1}>
            <Typography variant="h6" fontWeight="bold">
              {ebook.genre.name}
            </Typography>
            <Rate value={ebook.grade} />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={4}
        md={3}
        lg={2}
        container
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h4" textAlign="center">
          <EbookPrice
            authorId={ebook.author.id}
            price={ebook.prize}
            promotion={ebook.promotion}
          />
        </Typography>
      </Grid>
      <Grid
        item
        xs={1}
        container
        justifySelf="end"
        justifyContent="center"
        alignItems="center"
      >
        <IconButton onClick={() => basketContext?.removeEbook(ebook)}>
          <Delete fontSize="large" htmlColor="black" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

const Basket = () => {
  const userContext = useContext(UserContext);
  const userId = userContext?.user.data?.id;
  const isLogged = userContext?.user.logged;

  const notificationContext = useContext(NotificationContext);

  const basketContext = useContext(BasketContext);
  const basket = basketContext?.basket;

  const basketEbooks = basket?.ebooks;

  const locationUrl = useLocation().pathname;
  const navigate = useNavigate();

  const NOT_SUBMITED_TRANSACTION = "Nie udało się złożyć zamówienia";
  const SUCCESSFULY_SUBMITED_TRANSACTION = "Udało się złożyć zamówienie";

  if (!basketEbooks || !userContext) {
    return <Loading />;
  }

  const handleTransaction = () => {
    const basketEbooksIds: string[] = basketEbooks.map(
      (ebook: Ebook) => ebook.id
    );

    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      TransactionService.handleTransactionByTokens(userId!, basketEbooksIds)
        .then((response) => {
          console.log(response);
          basketContext?.clear();
          notificationContext?.setNotification({
            isVisible: true,
            isSuccessful: true,
            message: SUCCESSFULY_SUBMITED_TRANSACTION,
          });
          navigate("/account-settings/transactions");
          TransactionService.getUserStats(userId as string).then((response) => {
            const statistics: Statistics = response.data;

            const newBoughtEbooksIds: string[] = [];

            statistics.buyed_books.result.forEach(
              (transaction: Transaction) => {
                newBoughtEbooksIds.push(
                  ...transaction.books.map((ebook: Ebook) => ebook.id)
                );
              }
            );

            userContext.setBoughtEbooksIds(newBoughtEbooksIds)
          });
        })
        .catch((error) => {
          console.log(error);
          notificationContext?.setNotification({
            isVisible: true,
            isSuccessful: false,
            message: NOT_SUBMITED_TRANSACTION,
          });
        });
    } else {
      TransactionService.handleTransactionByPayPal(userId!, basketEbooksIds)
        .then((response) => {
          const paypalRedirect: string = response.data;
          console.log(paypalRedirect);
          basketContext?.clear();

          notificationContext?.setNotification({
            isVisible: true,
            isSuccessful: true,
            message: SUCCESSFULY_SUBMITED_TRANSACTION,
          });

          window.location.href = paypalRedirect;
        })
        .catch((error) => {
          console.log(error);
          notificationContext?.setNotification({
            isVisible: true,
            isSuccessful: true,
            message: NOT_SUBMITED_TRANSACTION,
          });
        });
    }
  };

  return (
    <Grid item container justifyContent="center" marginTop={2}>
      <Grid item xs={10} container direction="column">
        <Grid item container direction="column">
          <Typography variant="h4">
            Twój koszyk ({basketEbooks?.length})
          </Typography>
          <Grid
            item
            container
            direction="column"
            borderTop="1px solid silver"
            marginTop={4}
          >
            {basketEbooks?.map((ebook: Ebook) => (
              <BasketEbookView key={ebook.id} ebook={ebook} />
            ))}
          </Grid>
        </Grid>
        {basketEbooks?.length != 0 && (
          <Grid
            item
            container
            direction="column"
            alignItems="end"
            marginTop={2}
            rowSpacing={2}
          >
            <Grid item>
              <Typography variant="h5" display="inline">
                Razem do zapłaty:
              </Typography>
              <Typography variant="h5" display="inline" fontWeight="bold">
                {` ${basket?.totalPrice.toFixed(2)}`} zł
              </Typography>
            </Grid>
            <Grid item>
              {isLogged ? (
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                  onClick={handleTransaction}
                >
                  Zamawiam {`>>`}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                  onClick={() => navigate("/login", { state: locationUrl })}
                >
                  Zaloguj
                </Button>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
      <HorizontalAd/>
    </Grid>
  );
};

export default Basket;
