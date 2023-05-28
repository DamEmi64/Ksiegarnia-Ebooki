import {
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { Search } from "@mui/icons-material";
import Ebook from "../../../models/api/ebook";
import EbookService from "../../../services/EbookService";
import useScrollPosition from "../../../components/useScrollPosition";
import SelectPageSize from "../../../components/SelectPageSize";
import Loading from "../../../pages/Loading";
import UserService from "../../../services/UserService";
import PagedResponse from "../../../models/api/pagedResponse";
import OwnedEbook from "./OwnedEbook";

const OwnedEbooks = () => {
  const userId = useContext(UserContext)?.user.data?.id;

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  const page = useRef<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const actualPageSize = useRef<number>(12);
  const numberOfPages = useRef<number>(0);

  useEffect(() => {
    //handleSearch();
    EbookService.search({
      ebookSearchCriteria: { phrase: searchPhrase },
      page: page.current,
      pageSize: actualPageSize.current,
    }).then((response) => {
      const data: PagedResponse = response.data;
      const newEbooks: Ebook[] = data.result;
      setEbooks((ebooks: Ebook[]) => [...ebooks, ...newEbooks]);
      numberOfPages.current = data.number_of_pages;
    });
  }, []);

  useScrollPosition({
    handleScrollBottom() {
      if (page.current + 1 <= numberOfPages.current) {
        page.current++;
        handleSearch();
      }
    },
  });

  if (!userId) {
    return <Loading />;
  }

  const handleSearch = () => {
    EbookService.search({
      ebookSearchCriteria: { phrase: searchPhrase },
      page: page.current,
      pageSize: actualPageSize.current,
    }).then((response) => {
      const data: PagedResponse = response.data;
      const newEbooks: Ebook[] = data.result;
      setEbooks((ebooks: Ebook[]) => [...ebooks, ...newEbooks]);
      numberOfPages.current = data.number_of_pages;
    });
    /*UserService.getOwnedEbooks({
      userId: userId,
      phrase: searchPhrase,
      page: page.current,
      pageSize: actualPageSize.current,
    })
      .then((response) => {
        const data: PagedResponse = response.data;
        const newEbooks: Ebook[] = data.result;
        setEbooks((ebooks: Ebook[]) => [...ebooks, ...newEbooks]);
        numberOfPages.current = data.number_of_pages;
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
      */
  };

  const handleSearchWithReplace = () => {
    page.current = 1;
    /*UserService.getOwnedEbooks({
      userId: userId,
      phrase: searchPhrase,
      page: page.current,
      pageSize: actualPageSize.current,
    }).then((response) => {
      const data: PagedResponse = response.data;
      const newEbooks: Ebook[] = data.result;
      setEbooks(newEbooks);
      numberOfPages.current = data.number_of_pages;
    });*/
    EbookService.search({
      ebookSearchCriteria: { phrase: searchPhrase },
      page: page.current,
      pageSize: actualPageSize.current,
    }).then((response) => {
      const data: PagedResponse = response.data;
      const newEbooks: Ebook[] = data.result;
      setEbooks(newEbooks);
      numberOfPages.current = data.number_of_pages;
    });
  };

  const handleSelectPageSize = (newPageSize: number) => {
    actualPageSize.current = newPageSize;
    setPageSize(newPageSize);
    handleSearchWithReplace();
  };

  return (
    <Grid
      item
      container
      direction="column"
      alignItems="center"
      rowGap={6}
      marginTop={-1}
    >
      <Grid
        item
        container
        direction="row"
        justifyContent="space-between"
        marginBottom={2}
        rowGap={4}
      >
        <Grid item xs={12} lg={5} xl={7}>
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
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={5}
          xl={4}
          container
          direction="row"
          alignItems="center"
        >
          <SelectPageSize
            pageSize={pageSize}
            handleSetPageSize={handleSelectPageSize}
          />
        </Grid>
      </Grid>
      <Grid item container rowGap={6}>
        {ebooks.map((ebook: Ebook) => (
          <OwnedEbook key={ebook.id} ebook={ebook} />
        ))}
      </Grid>
    </Grid>
  );
};

export default OwnedEbooks;
