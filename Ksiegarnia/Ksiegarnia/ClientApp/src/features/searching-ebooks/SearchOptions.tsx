import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import SelectGenre from "./SelectGenre";
import FilterPrice from "./FilterPrice";
import SelectAuthor from "./SelectAuthor";
import EbookSearchCriteria from "../../models/ebookSearchCriteria";

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
