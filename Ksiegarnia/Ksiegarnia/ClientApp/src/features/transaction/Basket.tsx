import { Button, Grid, IconButton, Typography } from "@mui/material";
import Rate from "../../components/Rate";
import Ebook from "../../models/api/ebook";
import Image from "../../components/Image";
import { useContext } from "react";
import { BasketContext } from "../../context/BasketContext";
import { Delete } from "@mui/icons-material";
import { UserContext } from "../../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import TransactionService from "../../services/TransactionService";
import Loading from "../../pages/Loading";
import { NotificationContext } from "../../context/NotificationContext";

const BasketEbookView = (props: { ebook: Ebook }) => {
  const ebook = props.ebook;

  const basketContext = useContext(BasketContext);

  return (
    <Grid
      item
      container
      padding={4}
      justifyContent="space-between"
      borderBottom="1px solid silver"
    >
      <Grid item xs={9} container columnGap={6}>
        <Grid item height="195px">
          <Image
            alt={ebook.title}
            src={ebook.picture}
            style={{ maxWidth: "100%", width: "auto", height: "100%" }}
          />
        </Grid>
        <Grid
          item
          xs={8}
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
            <Rate value={5} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item alignSelf="center">
        <Typography variant="h4" textAlign="center">
          {ebook.prize} zł
        </Typography>
      </Grid>
      <Grid item alignSelf="center">
        <IconButton
          onClick={() => basketContext?.removeEbook(ebook.id, ebook.prize)}
        >
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

  const notificationContext = useContext(NotificationContext)
  
  const basketContext = useContext(BasketContext)
  const basket = basketContext?.basket;

  const basketEbooks = basket?.ebooks;

  const locationUrl = useLocation().pathname;
  const navigate = useNavigate();

  const NOT_SUBMITED_TRANSACTION = "Nie udało się złożyć zamówienia"
  const SUCCESSFULY_SUBMITED_TRANSACTION = "Udało się złożyć zamówienie" 

  if (!basketEbooks || !userContext) {
    return <Loading />;
  }

  const handleTransaction = () => {
    const basketEbooksIds: string[] = basketEbooks.map(
      (ebook: Ebook) => ebook.id
    );

    TransactionService.handleTransaction(userId!, basketEbooksIds)
    .then((response) => {
      console.log(response)
      basketContext?.clear()
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: true,
        message: SUCCESSFULY_SUBMITED_TRANSACTION
      })
      navigate("/account-settings/transactions")
    })
    .catch((error) => {
      console.log(error)
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: false,
        message: NOT_SUBMITED_TRANSACTION
      })
    })
  };

  return (
    <Grid
      item
      container
      direction="column"
      marginLeft={20}
      marginRight={20}
      marginTop={4}
    >
      <Typography variant="h4">Twój koszyk ({basketEbooks?.length})</Typography>
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
              {` ${basket?.totalPrice}`} zł
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
  );
};

export default Basket;
