import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  Grid,
} from "@mui/material";
import { EbookSortOptions } from "../models/ebookSortOptions";
import { useState, useEffect } from "react";
import React from "react";

interface SortNameMapping {
  name: string;
  sort: string;
}

const sortNameMappings: SortNameMapping[] = [
  {
    name: "-",
    sort: "",
  },
  {
    name: "Tytuł: malejąco",
    sort: EbookSortOptions.DescByName,
  },
  {
    name: "Kategoria: malejąco",
    sort: EbookSortOptions.DescByGenre,
  },
  {
    name: "Cena: najmniejsza",
    sort: EbookSortOptions.DescByPrize,
  },
  {
    name: "Data: najwcześniej",
    sort: EbookSortOptions.DescByDate,
  },
  {
    name: "Autor: malejąco",
    sort: EbookSortOptions.DescByAuthor,
  },
  {
    name: "Tytul: rosnąco",
    sort: EbookSortOptions.AscByName,
  },
  {
    name: "Kategoria: rosnąco",
    sort: EbookSortOptions.AscByGenre,
  },
  {
    name: "Cena: największa",
    sort: EbookSortOptions.AscByPrize,
  },
  {
    name: "Data: najpóźniej",
    sort: EbookSortOptions.AscByDate,
  },
  {
    name: "Autor: rosnąco",
    sort: EbookSortOptions.AscByAuthor,
  },
];

const SortEbooks = (props: {
  sortValue: string;
  handleSetSort: (sortValue: string) => void;
}) => {
  const [sortValue, setSortValue] = useState<string>(props.sortValue);

  useEffect(() => {
    setSortValue(props.sortValue);
  }, [props.sortValue]);

  const handleChangeSize = (event: SelectChangeEvent) => {
    props.handleSetSort(event.target.value);
  };

  return (
    <Grid container alignItems="center" columnGap={2}>
      <Typography variant="h6" display="inline" marginTop={-1}>
        Sortuj wg:
      </Typography>
      <Grid item xs={7}>
        <FormControl fullWidth>
          <Select value={sortValue} onChange={handleChangeSize}>
            {sortNameMappings.map((sortNameMapping: SortNameMapping) => (
              <MenuItem key={sortNameMapping.sort} value={sortNameMapping.sort}>
                {sortNameMapping.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SortEbooks;
