import { Button, Grid, Typography } from "@mui/material";
import Ebook from "../models/api/ebook";
import Image from "./Image";
import Rate from "./EbookRate";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { BasketContext } from "../context/BasketContext";
import EbookPrice from "./EbookPrice";
import EbookImage from "./EbookImage";

const BasicEbookView = (props: {
  ebook: Ebook;
  showAddToCart?: boolean;
  preventRedirect?: boolean;
}) => {
  const [ebook, setEbook] = React.useState<Ebook>(props.ebook);

  const basketContext = React.useContext(BasketContext);

  useEffect(() => {
    setEbook(props.ebook);
  }, [props.ebook]);

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
            <EbookImage
              alt={ebook.title}
              src={ebook.picture}
              style={{ maxWidth: "100%", width: "auto", height: "100%" }}
              ebookDistinction={ebook.distinction}
            />
          </Link>
        ) : (
          <EbookImage
            alt={ebook.title}
            src={ebook.picture}
            style={{ maxWidth: "100%", width: "auto", height: "100%" }}
            ebookDistinction={ebook.distinction}
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
      {(props.showAddToCart && basketContext?.doShouldShowAddToBasket(ebook)) && (
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
            <EbookPrice authorId={ebook.author.id} price={ebook.prize} promotion={ebook.promotion} />
          </Typography>
        </Button>
      )}
    </Grid>
  );
};

export default BasicEbookView;
