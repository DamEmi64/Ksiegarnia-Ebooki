import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import Statistics from "../../../models/api/statistics";
import { Search } from "@mui/icons-material";
import SortEbooks from "../../../components/SortEbooks";
import { useRef, useState } from "react";
import SelectPageSize from "../../../components/SelectPageSize";
import Ebook from "../../../models/api/ebook";
import AuthorsStatistics from "./AuthorsStatistics";
import AuthorsEbooks from "./AuthorsEbooks";

const AuthorsPanel = () => {
  return (
    <Grid item container direction="column" marginTop={-3} rowGap={8}>
      <AuthorsStatistics/>
      <AuthorsEbooks/>
    </Grid>
  );
};

export default AuthorsPanel;
