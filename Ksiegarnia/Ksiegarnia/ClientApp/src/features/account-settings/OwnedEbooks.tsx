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
import SelectPageSize from "../../components/SelectPageSize";

interface Pagination{
    page: number,
    pageSize: number,
    numberOfPages: number
}

const OwnedEbooks = () => {
  const userContext = useContext(UserContext);

  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  const page = useRef<number>(1)
  const pageSize = useRef<number>(12)
  const numberOfPages = useRef<number>(0)

  useEffect(() => {
    handleSearch()
  }, []);

  const handleSearch = () => {
    EbookService.search({phrase: "E"}, undefined, page.current, pageSize.current)
    .then((response) => {
      const data = response.data;
      const newEbooks: Ebook[] = data.result;
      setEbooks((ebooks: Ebook[]) => [...ebooks, ...newEbooks]);
      numberOfPages.current = data.number_of_pages
    });
  }

  const handleSelectPageSize = (newPageSize: number) => {
    page.current = 1
    pageSize.current = newPageSize
    EbookService.search({phrase: "E"}, undefined, page.current, pageSize.current)
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
      <Grid item container direction="row" justifyContent="space-between" marginBottom={2}>
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
        <Grid item xs={3} container direction="row" alignItems="center">
          <SelectPageSize pageSize={pageSize.current} handleSetPageSize={handleSelectPageSize}/>
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
