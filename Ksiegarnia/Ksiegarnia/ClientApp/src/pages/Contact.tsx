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
      alignItems="center"
      marginTop={6}
    >
      <Grid item xs={6} container direction="column">
        <Typography variant="h4">Politechnika Wrocławska 1991-2023</Typography>
        <Typography marginTop={4}>
          PWr.pl sp. z o.o.ul. Kościuszki 1c44-100 Gliwice
        </Typography>
        <Typography>
          tel. (32) 230-98-63 e-mail: <HiddenEmail email={"mail"} />
          @ebookpoint.pl
        </Typography>
        <Typography>
          redakcja: <HiddenEmail email={"mail"} />
          @ebookpoint.pl
        </Typography>
      </Grid>
    </Grid>
  </CategoriesContent>
);

export default Contact;
