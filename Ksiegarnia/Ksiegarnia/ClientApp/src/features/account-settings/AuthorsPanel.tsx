import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import Statistics from "../../models/api/statistics";
import { Search } from "@mui/icons-material";
import SortEbooks from "../../components/SortEbooks";
import { useRef, useState } from "react";
import SelectPageSize from "../../components/SelectPageSize";
import Ebook from "../../models/api/ebook";

const StatisticData = (props: { title: string; value: string }) => {
  return (
    <Grid
      item
      xs={5}
      container
      justifyContent="space-between"
      borderBottom="1px solid silver"
    >
      <Typography variant="h6">{props.title}</Typography>
      <Typography variant="h5" fontWeight="bold">
        {props.value}
      </Typography>
    </Grid>
  );
};

const stats: Statistics = {
  createdEbooks: 20,
  profit: 1832,
  numberOfReceivers: 2000,
  profitPerEbook: 100,
};

const AuthorsPanel = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  const page = useRef<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const numberOfPages = useRef<number>(0);
  const [sort, setSort] = useState<string>("");

  const handleSetSort = (newSort: string) => {
    setSort(newSort)
  };

  const handleSetPageSize = (newPageSize: number) => {
    setPageSize(newPageSize)
  };

  return (
    <Grid item container direction="column" marginTop={-3} rowGap={8}>
      <Grid item container direction="column" rowGap={6}>
        <Typography variant="h5" fontWeight="bold">
          Statystyki twórcy:
        </Typography>
        <Grid item container justifyContent="center">
          <Grid item xs={10} container direction="column" rowGap={4}>
            <Grid item container justifyContent="space-between">
              <StatisticData
                title="Liczba dodanych książek:"
                value={stats.createdEbooks.toString()}
              />
              <StatisticData
                title="Przychód ze wszystkich książek:"
                value={stats.profit.toString() + "zł"}
              />
            </Grid>
            <Grid item container justifyContent="space-between">
              <StatisticData
                title="Liczba odbiorców:"
                value={stats.numberOfReceivers.toString()}
              />
              <StatisticData
                title="Średni przychód na książkę:"
                value={stats.profitPerEbook.toString() + "zł"}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container rowGap={4}>
        <Typography variant="h5" fontWeight="bold">
          Lista dodanych książek:
        </Typography>
        <Grid item container alignItems="stretch" columnGap={4}>
          <Grid item xs={8}>
            <TextField
              placeholder="Wpisz tytuł"
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => console.log("AA")}>
                    <Search />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={3} container alignItems="center">
            <Grid item>
              <Button
                variant="contained"
                style={{ padding: "8px 24px", borderRadius: "12px" }}
              >
                Dodaj ebooka
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container justifyContent="space-between">
          <Grid item xs={4}>
            <SortEbooks
              sortValue={sort}
              handleSetSort={handleSetSort}
            />
          </Grid>
          <Grid item xs={3}>
            <SelectPageSize
              pageSize={pageSize}
              handleSetPageSize={handleSetPageSize}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AuthorsPanel;
