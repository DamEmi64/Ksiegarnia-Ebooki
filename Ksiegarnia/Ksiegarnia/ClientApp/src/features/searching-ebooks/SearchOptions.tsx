import {
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import SelectGenre from "./SelectGenre";
import FilterPrice from "./FilterPrice";
import SelectAuthor from "./SelectAuthor";

const SearchOptions = () => {

  return (
    <Grid item container direction="column">
      <Paper style={{padding: 22, display: "flex", flexDirection: "column", rowGap: 20}}>
        <Typography variant="h5" textAlign="center">Filtry</Typography>
        <SelectGenre/>
        <SelectAuthor/>
        <FilterPrice/>
      </Paper>
    </Grid>
  );
};

export default SearchOptions;
