import { Grid, Typography } from "@mui/material";
import HiddenEmail from "../components/HiddenEmail";
import React from "react";

const Footer = () => (
  <Grid item container marginTop={8}>
    <footer>
      <Grid
        container
        direction="column"
        marginBottom={5}
        marginLeft={{ xs: 2, sm: 12 }}
      >
        <Typography>&copy; PWr 2023</Typography>
        <Typography>Ebookworld sp. z o.o.</Typography>
        <Typography>ul. Kościuszki 12-345 Gliwice</Typography>
        <Typography>tel. (12) 345-67-89</Typography>
        <Typography>
          e-mail: <HiddenEmail email={"ziwg-pwr"} />
          @outlook.com
        </Typography>
        <Typography>redakcja:</Typography>
        <Typography>
          <HiddenEmail email={"ziwg-pwr"} />
          @outlook.com
        </Typography>
      </Grid>
    </footer>
  </Grid>
);

export default Footer;
