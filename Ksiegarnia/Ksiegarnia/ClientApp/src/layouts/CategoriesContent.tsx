﻿import {
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LinksSidePanel from "./LinksSidePanel";
import { useEffect, useState } from "react";
import GenreService from "../services/GenreService";
import Genre from "../models/api/genre";
import React from "react";
import { ArrowLeft } from "@mui/icons-material";
import HorizontalAd from "../components/HorizontalAd";

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
          display: {
            xs: "none",
            lg: "flex",
            justifyContent: "center",
          },
        }}
      >
        <LinksSidePanel
          title="Kategorie"
          links={genres.map((genre: Genre) => ({
            title: genre.name,
            url: `/ebooks?genre=${genre.name}`,
            hint: genre.description
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
            zIndex: 100,
          },
          position: "fixed",
        }}
      >
        <IconButton onClick={handleClick}>
          <ArrowLeft fontSize="large"/>
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          {[
            genres.map((genre: Genre) => (
              <MenuItem key={genre.id} onClick={() => navigate(`/ebooks?genre1=${genre.name}`)}>
                {genre.name}
              </MenuItem>
            )),
          ]}
        </Menu>
      </Box>
    );
  };

  return (
    <Grid container justifyContent="center" columnGap={{md: 8}}>
      <Grid
        item
        xs={1}
        lg={1.5}
        container
        justifyContent="center"
        alignItems="start"
      >
        <SmallScreenCategories />
        <WideScreenCategories />
      </Grid>
      <Grid
        item
        container
        xs={10}
        md={9}
        justifyContent="center"
        rowGap={5}
      >
        <Grid
          item
          xs={11}
          container
          justifyContent="center"
          alignItems="stretch"
        >
          {props.children}
        </Grid>
      </Grid>
      <Grid item xs={1} lg={1.5} display={{ xs: "flex", md: "none" }}></Grid>
    </Grid>
  );
};

export default CategoriesContent;
