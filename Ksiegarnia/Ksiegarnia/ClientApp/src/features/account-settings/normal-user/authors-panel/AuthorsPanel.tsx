import { Grid } from "@mui/material";
import AuthorsStatistics from "./AuthorsStatistics";
import AuthorsEbooks from "./AuthorsEbooks";
import React from "react";
import AccountSettings from "../../../../pages/AccountSettings";

const AuthorsPanel = () => {
  return (
    <AccountSettings title="Panel twórcy">
      <Grid item container direction="column" marginTop={-3} rowGap={8}>
        <AuthorsStatistics />
        <AuthorsEbooks />
      </Grid>
    </AccountSettings>
  );
};

export default AuthorsPanel;
