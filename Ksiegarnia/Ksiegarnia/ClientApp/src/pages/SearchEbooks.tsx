import { useSearchParams } from "react-router-dom";
import CategoriesContent from "../layouts/CategoriesContent";
import SearchOptions from "../features/searching-ebooks/SearchOptions";
import { Grid } from "@mui/material";
import FoundEbooks from "../features/searching-ebooks/FoundEbooks";

const SearchEbooks = () => {
  return (
    <Grid container justifyContent="center" rowGap={4}>
      <Grid
        item
        xs={10}
        md={6}
        lg={4}
        xl={1.5}
        container
        justifyContent="end"
        alignItems="start"
      >
        <SearchOptions />
      </Grid>
      <Grid item container xs={10} md={9} justifyContent="center" rowGap={5}>
        <Grid
          item
          xs={11}
          container
          justifyContent="center"
          alignItems="stretch"
        >
          <FoundEbooks />
        </Grid>
      </Grid>
      <Grid item xs={0} xl={1.5} display={{ xs: "flex", md: "none" }}></Grid>
    </Grid>
  );
};

export default SearchEbooks;
