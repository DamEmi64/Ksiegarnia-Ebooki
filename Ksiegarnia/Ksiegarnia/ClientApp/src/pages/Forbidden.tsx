import { Error } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import React from "react";

const Forbidden = () => (
  <Grid
    item
    container
    alignSelf="center"
    justifyContent="center"
    alignItems="center"
  >
    <Error fontSize="large" style={{ color: "#EB4B36" }} />
    <Typography variant="h4" marginLeft={2}>
      403: Brak dostępu do zasobu
    </Typography>
  </Grid>
);

export default Forbidden;
