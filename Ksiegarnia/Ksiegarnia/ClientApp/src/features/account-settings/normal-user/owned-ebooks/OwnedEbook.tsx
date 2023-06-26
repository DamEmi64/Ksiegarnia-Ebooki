import { Grid } from "@mui/material";
import BasicEbookView from "../../../../components/BasicEbookView";
import Ebook from "../../../../models/api/ebook";
import { Link } from "react-router-dom";
import React from "react";

const OwnedEbook = (props: { ebook: Ebook }) => {
  const ebook = props.ebook;

  return (
    <Grid key={ebook.id} item xs={12} sm={6} md={4} lg={3} xl={2.4}>
      <Link to={ebook.id} target="_blank" style={{display: "flex", justifyContent: "center"}}>
        <Grid item xs={10}>
          <BasicEbookView ebook={ebook} preventRedirect={true} />
        </Grid>
      </Link>
    </Grid>
  );
};

export default OwnedEbook;
