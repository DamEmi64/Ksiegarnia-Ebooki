import { Button, Grid, Typography } from "@mui/material";
import Ebook from "../models/api/ebook";
import Image from "./Image";
import Rate from "./Rate";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { BasketContext } from "../context/BasketContext";

const BasicEbookView = (props: {
  ebook: Ebook;
  showAddToCart?: boolean;
  preventRedirect?: boolean;
}) => {
  const [ebook, setEbook] = React.useState<Ebook>(props.ebook);

  const userId = useContext(UserContext)?.user.data?.id;
  const basketContext = React.useContext(BasketContext);

  useEffect(() => {
    setEbook(props.ebook);
  }, [props.ebook]);

  const checkShowAddToCart = (): boolean => {
    if (!props.showAddToCart) {
      return false;
    }

    if (userId === ebook.author.id) {
      return false;
    }

    if (basketContext?.containsEbook(ebook.id)) {
      return false;
    }

    return true;
  };

  return (
    <Grid
      item
      container
      className="ebook"
      direction="column"
      alignItems="stretch"
      rowGap={2}
    >
      <Grid
        item
        height="220px"
        className="pointer"
        container
        justifyContent="center"
        alignItems="center"
      >
        {!props.preventRedirect ? (
          <Link to={`/Ebook/${ebook.id}`} style={{ height: "100%" }}>
            <Image
              alt={ebook.title}
              src={ebook.picture}
              style={{ maxWidth: "100%", width: "auto", height: "100%" }}
            />
          </Link>
        ) : (
          <Image
            alt={ebook.title}
            src={ebook.picture}
            style={{ maxWidth: "100%", width: "auto", height: "100%" }}
          />
        )}
      </Grid>
      <Grid item>
        <Typography variant="h6" textAlign="center">
          {ebook.title}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h6" textAlign="center">
          {ebook.author.firstName + " " + ebook.author.lastName}
        </Typography>
      </Grid>
      <Grid item container justifyContent="center">
        <Rate value={5} />
      </Grid>
      {checkShowAddToCart() && (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => basketContext?.addEbook(ebook)}
        >
          <ShoppingCartOutlined
            fontSize="large"
            style={{ color: "white", marginRight: 6 }}
          />
          <Typography variant="h6" display="inline">
            {ebook.prize.toPrecision(3)} zł
          </Typography>
        </Button>
      )}
    </Grid>
  );
};

export default BasicEbookView;
