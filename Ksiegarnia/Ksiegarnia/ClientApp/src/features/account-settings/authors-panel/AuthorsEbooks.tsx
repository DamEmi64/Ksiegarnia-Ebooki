﻿import { Grid, Typography, TextField, Button, IconButton } from "@mui/material";
import SelectPageSize from "../../../components/SelectPageSize";
import SortEbooks from "../../../components/SortEbooks";
import { useState, useRef, useEffect } from "react";
import Ebook from "../../../models/api/ebook";
import { Search } from "@mui/icons-material";
import AuthorsEbook from "./AuthorsEbook";
import EbookService from "../../../services/EbookService";
import useScrollPosition from "../../../components/useScrollPosition";
import { useNavigate } from "react-router-dom";

const AuthorsEbooks = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  const page = useRef<number>(1);
  const numberOfPages = useRef<number>(0);

  const [pageSize, setPageSize] = useState<number>(12);
  const actualPageSize = useRef<number>(12);

  const [sort, setSort] = useState<string | undefined>(undefined);
  const actualSort = useRef<string | undefined>(undefined);

  const navigate = useNavigate()

  useEffect(() => {
    handleSearch()
  }, []);

  const handleSearchPage = () => {
    EbookService.search({phrase: "E"}, actualSort.current, page.current, actualPageSize.current)
    .then((response) => {
      const data = response.data;
      const newEbooks: Ebook[] = data.result;
      setEbooks((ebooks: Ebook[]) => [...ebooks, ...newEbooks]);
      numberOfPages.current = data.number_of_pages
    });
  }

  const handleSearch = () => {
    EbookService.search({phrase: "E"}, actualSort.current, page.current, actualPageSize.current)
    .then((response) => {
      const data = response.data;
      const newEbooks: Ebook[] = data.result;
      setEbooks(newEbooks);
      numberOfPages.current = data.number_of_pages
    });
  }

  const handleSelectPageSize = (newPageSize: number) => {
    page.current = 1
    actualPageSize.current = newPageSize
    setPageSize(newPageSize)
    handleSearch()
  };

  const handleSetSort = (newSort: string) => {
    actualSort.current = newSort
    setSort(newSort);
  };

  useScrollPosition({
    handleScrollBottom() {
      if (page.current + 1 <= numberOfPages.current) {
        page.current++
        handleSearchPage()
      }
    },
  });

  return (
    <Grid item container rowGap={5}>
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
                <IconButton onClick={() => handleSearch()}>
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
              onClick={() => navigate('/ebook/create')}
            >
              Dodaj ebooka
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item container justifyContent="space-between">
        <Grid item xs={4}>
          <SortEbooks sortValue={sort ? sort : ""} handleSetSort={handleSetSort} />
        </Grid>
        <Grid item xs={3}>
          <SelectPageSize
            pageSize={pageSize}
            handleSetPageSize={handleSelectPageSize}
          />
        </Grid>
      </Grid>
      <Grid item container rowGap={6} marginTop={2}>
        {ebooks.map((ebook: Ebook) => (
          <AuthorsEbook key={ebook.id} ebook={ebook} update={handleSearch}/>
        ))}
      </Grid>
    </Grid>
  );
};

export default AuthorsEbooks;