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
import Loading from "../../pages/Loading";
import UserService from "../../services/UserService";
import PagedResponse from "../../models/api/pagedResponse";

const OwnedEbooks = () => {
  const userId = useContext(UserContext)?.user.data?.id;

  const [searchPhrase, setSearchPhrase] = useState<string>("")
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  const page = useRef<number>(1)
  const [pageSize, setPageSize] = useState<number>(12);
  const actualPageSize = useRef<number>(12);
  const numberOfPages = useRef<number>(0)

  useEffect(() => {
    handleSearch()
  }, []);

  if(!userId){
    return <Loading/>
  }

  const handleSearch = () => {
    UserService.getOwnedEbooks(userId, page.current, actualPageSize.current)
    .then((response) => {
      const data: PagedResponse = response.data;
      const newEbooks: Ebook[] = data.result;
      setEbooks((ebooks: Ebook[]) => [...ebooks, ...newEbooks]);
      numberOfPages.current = data.number_of_pages
    });
  }

  const handleSearchWithReplace = () => {
    page.current = 1
    UserService.getOwnedEbooks(userId, page.current, actualPageSize.current)
    .then((response) => {
      const data: PagedResponse = response.data;
      const newEbooks: Ebook[] = data.result;
      setEbooks(newEbooks);
      numberOfPages.current = data.number_of_pages
    });
  }

  const handleSelectPageSize = (newPageSize: number) => {
    actualPageSize.current = newPageSize
    setPageSize(newPageSize)
    handleSearchWithReplace()
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
            value={searchPhrase}
            onChange={(event: any) => setSearchPhrase(event.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearchWithReplace}>
                  <Search />
                </IconButton>
              ),
            }}
          />
        </Grid>
        <Grid item xs={3} container direction="row" alignItems="center">
          <SelectPageSize pageSize={pageSize} handleSetPageSize={handleSelectPageSize}/>
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
