import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const pageSizes: number[] = [12, 20, 40, 80, 100];

const SelectPageSize = (props: {
  pageSize: number;
  handleSetPageSize: (pageSize: number) => void;
}) => {
  const [pageSize, setPageSize] = useState<number>(props.pageSize);

  useEffect(() => {
    setPageSize(props.pageSize);
  }, [props.pageSize]);

  const handleChangeSize = (event: SelectChangeEvent) => {
    props.handleSetPageSize(+event.target.value);
  };

  return (
    <Grid container alignItems="center" columnGap={2}>
      <Typography variant="h6" display="inline" marginTop={-1}>
        Pokaż na stronie:
      </Typography>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <Select value={pageSize.toString()} onChange={handleChangeSize}>
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
