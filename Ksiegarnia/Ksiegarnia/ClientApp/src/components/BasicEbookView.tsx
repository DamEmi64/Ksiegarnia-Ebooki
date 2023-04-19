import { Button, Grid, Typography } from "@mui/material";
import Ebook from "../models/api/ebook";
import Image from "./Image";
import Rate from "./Rate";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

const BasicEbookView = (props: { ebook: Ebook; showAddToCart?: boolean }) => {
  const [ebook, setEbook] = React.useState<Ebook>(props.ebook);

  useEffect(() => {
    setEbook(props.ebook);
  }, [props.ebook]);

  const navigate = useNavigate();

  return (
    <Grid item container direction="column" alignItems="stretch" rowGap={2}>
      <Grid
        item
        height="220px"
        className="pointer"
        container
        justifyContent="center"
        alignItems="center"
        onClick={() => navigate(`/Ebook/${ebook.id}`)}
      >
        <Image
          alt={ebook.title}
          src={ebook.picture}
          style={{maxWidth: "100%", width: "auto", height: "100%"}}
        />
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
      {props.showAddToCart && (
        <Button variant="contained" color="secondary">
          <ShoppingCartOutlined fontSize="large" style={{ color: "white" }} />
          {ebook.prize} zł
        </Button>
      )}
    </Grid>
  );
};

export default BasicEbookView;
