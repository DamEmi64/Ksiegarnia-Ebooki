import { Grid } from "@mui/material";
import AuthorsStatistics from "./AuthorsStatistics";
import AuthorsEbooks from "./AuthorsEbooks";
import React from "react";

const AuthorsPanel = () => {
  return (
    <Grid item container direction="column" marginTop={-3} rowGap={8}>
      <AuthorsStatistics/>
      <AuthorsEbooks/>
    </Grid>
  );
};

export default AuthorsPanel;
