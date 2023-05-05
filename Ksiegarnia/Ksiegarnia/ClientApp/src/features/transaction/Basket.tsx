import { Button, Grid, IconButton, Typography } from "@mui/material";
import Rate from "../../components/Rate";
import Ebook from "../../models/api/ebook";
import Image from "../../components/Image";
import { useContext } from "react";
import { BasketContext } from "../../context/BasketContext";
import { Delete } from "@mui/icons-material";

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
  const basket = useContext(BasketContext)?.basket;

  const basketEbooks = basket?.ebooks;

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
        <Grid item container direction="column" alignItems="end" marginTop={2} rowSpacing={2}>
          <Grid item>
            <Typography variant="h5" display="inline">
              Razem do zapłaty:
            </Typography>
            <Typography variant="h5" display="inline" fontWeight="bold">
              {` ${basket?.totalPrice}`} zł
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" style={{paddingLeft: 40, paddingRight: 40}}>
              Zamawiam {`>>`}
            </Button>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default Basket;
