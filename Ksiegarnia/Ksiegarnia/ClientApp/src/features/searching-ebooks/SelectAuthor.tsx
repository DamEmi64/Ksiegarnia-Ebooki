import { Autocomplete, Grid, List, ListItem, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const SelectAuthor = () => {

  const [authors, setAuthors] = useState<string[]>([])

  const [selectedAuthor, setSelectedAuthor] = useState<string>("")

  useEffect(() => {

  }, [])

  return (
    <Grid item>
      <Typography variant="h6" marginBottom={1}>Autor</Typography>
      <Autocomplete
        disablePortal
        options={authors}
        renderInput={(params) => <TextField {...params} label="Autor" />}
      />
    </Grid>
  );
};

export default SelectAuthor;
