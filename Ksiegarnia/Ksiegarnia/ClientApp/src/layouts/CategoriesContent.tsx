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
import LinksSidePanel from "./LinksSidePanel";
import { useEffect, useState } from "react";
import GenreService from "../services/GenreService";
import Genre from "../models/api/genre";
import Navbar from "./Navbar";
import React from "react";

const CategoriesContent = (props: { children: React.ReactNode }) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    GenreService.getAll().then((response) => {
      setGenres(response.data);
    });
  }, []);

  const WideScreenCategories = () => {
    return (
      <Box
        sx={{
          display: { xs: "none", lg: "flex", justifyContent: "stretch" },
        }}
      >
        <LinksSidePanel
          title="Kategorie"
          links={genres.map((genre: Genre) => ({
            title: genre.name,
            url: genre.name,
          }))}
        />
      </Box>
    );
  };

  const SmallScreenCategories = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
      setAnchorEl(null);
    };

    return (
      <Box
        sx={{
          display: {
            xs: "flex",
            lg: "none",
            justifyContent: "stretch",
            marginTop: 40,
          },
        }}
      >
        <Button
          variant="contained"
          onClick={handleClick}
          style={{ padding: "5px 60px" }}
        >
          <Typography variant="h5">Kategorie</Typography>
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          {[
            genres.map((genre: Genre) => (
              <MenuItem key={genre.id} onClick={() => navigate(genre.name)}>
                {genre.name}
              </MenuItem>
            )),
          ]}
        </Menu>
      </Box>
    );
  };

  return (
    <Grid container justifyContent="start">
      <Grid item xs={1}>
        <SmallScreenCategories />
        <WideScreenCategories />
      </Grid>
      <Grid
        item
        container
        xs={10}
        direction="column"
        alignItems="center"
        rowGap={5}
      >
        <Grid item container justifyContent="center">
          <Navbar />
        </Grid>
        <Grid item container justifyContent="center" alignItems="stretch">
          {props.children}
        </Grid>
      </Grid>
      <Grid item xs={1}></Grid>
    </Grid>
  );
};

export default CategoriesContent;
