import {
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Search } from "@mui/icons-material";
import Ebook from "../../models/api/ebook";
import EbookService from "../../services/EbookService";
import BasicEbookView from "../../components/BasicEbookView";
import useScrollPosition from "../../components/useScrollPosition";

interface Pagination{
    page: number,
    pageSize: number,
    numberOfPages: number
}

const pageSizes: number[] = [12, 20, 40, 80, 100];

const OwnedEbooks = () => {
  const userContext = useContext(UserContext);

  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  const page = useRef<number>(1)
  const [pageSize, setPageSize] = useState<number>(12)
  const actualPageSize = useRef<number>(12)
  const numberOfPages = useRef<number>(0)

  useEffect(() => {
    handleSearch()
  }, []);

  const handleSearch = () => {
    EbookService.search({}, undefined, page.current, actualPageSize.current)
    .then((response) => {
      const data = response.data;
      const newEbooks: Ebook[] = data.result;
      setEbooks((ebooks: Ebook[]) => [...ebooks, ...newEbooks]);
      numberOfPages.current = data.number_of_pages
    });
  }

  const handleChangeSize = (event: SelectChangeEvent) => {
    page.current = 1
    actualPageSize.current = +event.target.value
    setPageSize(actualPageSize.current)
    EbookService.search({}, undefined, page.current, actualPageSize.current)
    .then((response) => {
      const data = response.data;
      const newEbooks: Ebook[] = data.result;
      setEbooks(newEbooks);
      numberOfPages.current = data.number_of_pages
    });
  };

  useScrollPosition({
    handleScrollBottom() {
      if (page.current + 1 <= numberOfPages.current) {
        page.current++
        handleSearch()
      }
    },
  });

  return (
    <Grid
      item
      container
      direction="column"
      alignItems="center"
      rowGap={6}
      marginTop={-2}
    >
      <Grid item container direction="row" marginBottom={2}>
        <Grid item xs={8}>
          <TextField
            fullWidth
            placeholder="Wpisz tytuł lub autora książki"
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => console.log("AA")}>
                  <Search />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={4} container direction="row" alignItems="center">
          <Grid item xs={6} container justifyContent="center">
            <Typography variant="h6" display="inline" textAlign="center">
              Pokaż na stronie:
            </Typography>
          </Grid>
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
      </Grid>
      <Grid item container rowGap={6}>
        {ebooks.map((ebook: Ebook) => (
          <Grid key={ebook.id} item xs={2.4}>
            <Grid item xs={10}>
              <BasicEbookView ebook={ebook} />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default OwnedEbooks;
