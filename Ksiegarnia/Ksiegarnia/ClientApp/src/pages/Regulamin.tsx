import { Grid, Typography } from "@mui/material";
import CategoriesContent from "../layouts/CategoriesContent";
import React from "react";
import Regulations from "../components/Regulations";

const Regulamin = () => (
  <CategoriesContent>
    <Grid item container direction="column" rowGap={2}>
      <Regulations/>
    </Grid>
  </CategoriesContent>
);

export default Regulamin;
