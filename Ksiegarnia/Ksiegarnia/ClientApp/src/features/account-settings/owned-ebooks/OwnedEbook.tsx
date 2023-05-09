import { Grid, IconButton } from "@mui/material";
import BasicEbookView from "../../../components/BasicEbookView";
import Ebook from "../../../models/api/ebook";
import { useEffect, useState } from "react";
import EbookContentViewer from "./EbookContentViewer";
import { CloseOutlined } from "@mui/icons-material";
import { Link, Navigate, useNavigate } from "react-router-dom";
import EbookService from "../../../services/EbookService";

const OwnedEbook = (props: { ebook: Ebook }) => {
  const ebook = props.ebook;

  return (
    <Grid
      key={ebook.id}
      item
      xs={2.4}
    >
      <Link to={ebook.id} target="_blank">
        <Grid item xs={10}>
          <BasicEbookView ebook={ebook} preventRedirect={true} />
        </Grid>
      </Link>
    </Grid>
  );
};

export default OwnedEbook;
