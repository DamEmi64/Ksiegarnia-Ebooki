import { Search } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import LinksSidePanel from "./LinksSidePanel";
import { useEffect, useState } from "react";
import GenresService from "../services/GenresService";
import Genre from "../models/api/genre";
import Navbar from "./Navbar";

const CategoriesContent = (props: { children: React.ReactNode }) => {
  const [genres, setGenres] = useState<Genre[]>([
    {id: "2", name: "Podręczniki szkolne"},
    {id: "3", name: "Biznes i ekonomia"},
    {id: "4", name: "Dla dzieci"},
  ]);

  useEffect(() => {
    //GenresService.getAll().then((response) => {
      //setGenres(response.data);
    //});
  }, []);

  return (
    <Grid container>
      <Grid item xs={2}>
        <LinksSidePanel
          title="Kategorie"
          links={genres.map((genre: Genre) => ({
            title: genre.name,
            url: genre.name,
          }))}
        />
      </Grid>
      <Grid item xs={10} container direction="column" rowGap={5}>
        <Grid item>
          <Navbar/>
        </Grid>
        <Grid item>
            {props.children}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CategoriesContent;
