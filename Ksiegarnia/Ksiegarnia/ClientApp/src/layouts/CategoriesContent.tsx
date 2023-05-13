import { Search } from "@mui/icons-material";
import { Grid, IconButton, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import LinksSidePanel from "./LinksSidePanel";
import { useEffect, useState } from "react";
import GenreService from "../services/GenreService";
import Genre from "../models/api/genre";
import Navbar from "./Navbar";

const CategoriesContent = (props: { children: React.ReactNode }) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    GenreService.getAll().then((response) => {
      setGenres(response.data);
    });
  }, []);

  return (
    <Grid container>
      <LinksSidePanel
        title="Kategorie"
        links={genres.map((genre: Genre) => ({
          title: genre.name,
          url: genre.name,
        }))}
      />
      <Grid item xs={10} container direction="column" alignItems="center" rowGap={5}>
        <Grid item container justifyContent="center">
          <Navbar/>
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
