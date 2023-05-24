import {
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  TextField,
  Checkbox,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Genre from "../../models/api/genre";
import GenreService from "../../services/GenreService";
import { Search } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";

interface GenreState {
  name: string;
  checked: boolean;
  visible: boolean;
}

const SelectGenre = () => {
  const [genresStates, setGenresStates] = useState<GenreState[]>([]);

  const [searchGenreName, setSearchGenreName] = useState<string>("");

  const [searchParams, setSearchParams] = useSearchParams();
  const genreFromParam = searchParams.getAll("genre");

  useEffect(() => {
    GenreService.getAll()
    .then((response) => {
      const gotGenres: Genre[] = response.data;
      let newGenreStates: GenreState[] = gotGenres.map((genre: Genre) => ({
        name: genre.name,
        checked: false,
        visible: true,
      }));

      if (genreFromParam) {
        const foundGenreStates: GenreState[] = [];

        newGenreStates = newGenreStates.filter((genreState: GenreState) => {
          if (genreFromParam.includes(genreState.name)) {
            foundGenreStates.push(genreState);
            return false;
          }
          return true;
        });

        foundGenreStates.forEach(
          (genreState: GenreState) => (genreState.checked = true)
        );

        newGenreStates = [...foundGenreStates, ...newGenreStates];
      }

      setGenresStates(newGenreStates);
    });
  }, []);

  useEffect(() => {
    const newGenreStates1 = Object.assign([], genresStates);

    newGenreStates1.forEach((genreState: GenreState) => {
      if (genreState.checked) {
        return;
      }
      const nameContains = genreState.name
        .toLowerCase()
        .includes(searchGenreName.toLowerCase());

      genreState.visible = nameContains;
    });

    setGenresStates(newGenreStates1);
  }, [searchGenreName]);

  const handleSelectGenre = (event: React.ChangeEvent<HTMLInputElement>) => {
    const genreIndex: number = +event.target.name;

    let newGenresStates = [...genresStates];
    const oldGenreState = newGenresStates[genreIndex];
    let newGenreState = { ...oldGenreState, checked: !oldGenreState.checked };
    newGenresStates.splice(genreIndex, 1);

    if (newGenreState.checked) {
      if (
        !(
          genresStates[0].checked &&
          genresStates[1].checked &&
          genresStates[2].checked
        )
      ) {
        newGenresStates = [newGenreState, ...newGenresStates];
      }
    } else {
      newGenresStates = [...newGenresStates, newGenreState];
    }

    setGenresStates(newGenresStates);

    searchParams.delete("genre");

    let checkedGenres: string[] = [];

    for (let i = 0; i < 3; i++) {
      const genreState = newGenresStates[i];
      if (!genreState.checked) {
        break;
      }

      searchParams.append("genre", genreState.name);
      checkedGenres.push(genreState.name);
    }

    setSearchParams(searchParams);
  };

  return (
    <Grid item>
      <Typography variant="h6" marginBottom={1}>
        Kategorie
      </Typography>
      <TextField
        placeholder="Kategoria"
        value={searchGenreName}
        onChange={(event: any) => setSearchGenreName(event.target.value)}
        fullWidth
        InputProps={{
          endAdornment: (
            <IconButton>
              <Search />
            </IconButton>
          ),
        }}
      />
      <List style={{ maxHeight: 200, overflow: "auto" }}>
        {genresStates
          .filter((genreState: GenreState) => genreState.visible)
          .map((genre: GenreState, index: number) => (
            <ListItem key={index} style={{ paddingRight: 0 }}>
              <FormControlLabel
                label={genre.name}
                control={
                  <Checkbox
                    name={index.toString()}
                    checked={genre.checked}
                    onChange={handleSelectGenre}
                  />
                }
              />
            </ListItem>
          ))}
      </List>
    </Grid>
  );
};

export default SelectGenre;
