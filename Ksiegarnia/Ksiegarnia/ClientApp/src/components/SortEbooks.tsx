import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  Grid,
} from "@mui/material";
import { EbookSortOptions } from "../models/ebookSortOptions";
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
    name: "Cena: największa",
    sort: EbookSortOptions.DescByPrize,
  },
  {
    name: "Data: najpóźniej",
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
    name: "Cena: najmniejsza",
    sort: EbookSortOptions.AscByPrize,
  },
  {
    name: "Data: najwcześniej",
    sort: EbookSortOptions.AscByDate,
  },
  {
    name: "Autor: rosnąco",
    sort: EbookSortOptions.AscByAuthor,
  },
  {
    name: "Bestsellery",
    sort: EbookSortOptions.BestSeller
  }
];

const SortEbooks = (props: {
  sortValue: string;
  handleSetSort: (sortValue: string) => void;
}) => {

  const handleChangeSize = (event: SelectChangeEvent) => {
    const newSortValue: string = event.target.value
    props.handleSetSort(newSortValue);
  };

  return (
    <Grid container alignItems="center" columnGap={2}>
      <Typography variant="h6" display="inline" marginTop={-1}>
        Sortuj wg:
      </Typography>
      <Grid item flexGrow={1}>
        <FormControl fullWidth>
          <Select value={props.sortValue} onChange={handleChangeSize}>
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
