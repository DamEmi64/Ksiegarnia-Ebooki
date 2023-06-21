import { Grid, Typography } from "@mui/material";
import HiddenEmail from "../components/HiddenEmail";
import CategoriesContent from "../layouts/CategoriesContent";
import React from "react";

const Contact = () => (
  <CategoriesContent>
    <Grid
      item
      container
      justifyContent="center"
      marginTop={6}
    >
      <Grid item md={8} lg={6} container direction="column">
        <Typography variant="h4">Politechnika Wrocławska 2023</Typography>
        <Typography marginTop={4}>
          Ebookworld sp. z o.o. ul. Kościuszki 12-345 Gliwice
        </Typography>
        <Typography>
          tel.(12) 345-67-89 e-mail: <HiddenEmail email={"ziwg-pwr"} />
          @outlook.com
        </Typography>
        <Typography>
          redakcja: <HiddenEmail email={"ziwg-pwr"} />
          @outlook.com
        </Typography>
      </Grid>
    </Grid>
  </CategoriesContent>
);

export default Contact;
