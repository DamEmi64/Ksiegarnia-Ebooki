import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

const pageSizes: number[] = [12, 20, 40, 80, 100];

const SelectPageSize = (props: {
  pageSize: number;
  handleSetPageSize: (pageSize: number) => void;
}) => {
  const handleChangeSize = (event: SelectChangeEvent) => {
    const newPageSize: number = +event.target.value
    props.handleSetPageSize(newPageSize);
  };

  return (
    <Grid container alignItems="center" columnGap={2}>
      <Typography variant="h6" display="inline" marginTop={-1}>
        Pokaż na stronie:
      </Typography>
      <Grid item flexGrow={1}>
        <FormControl fullWidth>
          <Select value={props.pageSize.toString()} onChange={handleChangeSize}>
            {pageSizes.map((size: number) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SelectPageSize;
