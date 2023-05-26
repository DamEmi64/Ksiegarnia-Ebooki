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
        <Typography>&copy; PWr 1991-2023</Typography>
        <Typography>PWr.pl sp. z o.o.</Typography>
        <Typography>ul. Kościuszki 1c44-100 Gliwice</Typography>
        <Typography>tel. (32) 230-98-63</Typography>
        <Typography>
          e-mail: <HiddenEmail email={"mail"} />
          @ebookpoint.pl
        </Typography>
        <Typography>redakcja:</Typography>
        <Typography>
          <HiddenEmail email={"mail"} />
          @ebookpoint.pl
        </Typography>
      </Grid>
    </footer>
  </Grid>
);

export default Footer;
