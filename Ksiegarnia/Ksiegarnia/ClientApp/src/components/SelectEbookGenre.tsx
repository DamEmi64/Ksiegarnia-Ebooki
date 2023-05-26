import {
  FormControl,
  FormHelperText,
  Grid,
  GridSize,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import RedAsterisk from "./RedAsterisk";
import { useEffect, useState } from "react";
import Genre from "../models/api/genre";
import GenreService from "../services/GenreService";
import React from "react";

const SelectEbookGenre = (props: {
  label: string;
  selectedGenreId?: string;
  errorMessage?: string;
  isRequired?: boolean;
  formSize?: GridSize;
  handleOnChange: (genre: Genre) => void;
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<string>(
    props.selectedGenreId ? props.selectedGenreId : ""
  );

  useEffect(() => {
    GenreService.getAll().then((response) => {
      setGenres(response.data);
    });
  }, []);

  const handleChangeGenre = (event: SelectChangeEvent) => {
    const newSelectedGenreId: string = event.target.value;
    setSelectedGenreId(newSelectedGenreId)
    const selectedGenre: Genre = genres.filter(
      (genre: Genre) => genre.id === newSelectedGenreId
    )[0];
    props.handleOnChange(selectedGenre);
  };

  return (
    <Grid item container alignItems="center" columnGap={2}>
      <Grid item marginTop={-2}>
        <Typography variant="h6" display="inline" marginRight={0.5}>
          {props.label}
        </Typography>
        {props.isRequired && <RedAsterisk />}
      </Grid>
      <Grid item xs={props.formSize && props.formSize}>
        <FormControl fullWidth>
          <Select value={selectedGenreId} onChange={handleChangeGenre}>
            {genres.map((genre: Genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error>
            {props.errorMessage ? props.errorMessage : " "}
          </FormHelperText>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SelectEbookGenre;
