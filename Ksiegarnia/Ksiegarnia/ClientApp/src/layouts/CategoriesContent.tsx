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
      <Grid item xs={2} container justifyContent="center">
        <Paper style={{padding: "20px 40px 20px 20px", position: "fixed"}}>
          <LinksSidePanel
            title="Kategorie"
            links={genres.map((genre: Genre) => ({
              title: genre.name,
              url: genre.name,
            }))}
          />
        </Paper>
      </Grid>
      <Grid item xs={10} container justifyContent="stretch" rowGap={5}>
        <Grid item container justifyContent="center">
          <Navbar/>
        </Grid>
        <Grid item container justifyContent="stretch" alignItems="stretch">
            {props.children}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CategoriesContent;
