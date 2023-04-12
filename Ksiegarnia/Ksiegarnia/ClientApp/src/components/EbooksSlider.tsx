import { Grid, IconButton, Paper, Typography } from "@mui/material";
import Ebook from "../models/api/ebook";
import BasicEbookView from "./BasicEbookView";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import EbookService from "../services/EbookService";
import { EbookSortOptions } from "../models/ebookSortOptions";
import EbookSearchCriteria from "../models/ebookSearchCriteria";
import { AxiosResponse } from "axios";

const EbooksSlider = (props: {
  title: string;
  ebookSearchCriteria?: EbookSearchCriteria;
  sort?: string;
  searchBestsellers?: boolean;
}) => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  const pageSize = 5;
  const [page, setPage] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);

  useEffect(() => {
    const searchCriteria = props.ebookSearchCriteria;
    if (props.searchBestsellers) {
      EbookService.getBestsellers(page)
      .then((response) => {
        const data = response.data;
        const newEbooks: Ebook[] = data.result;
        setEbooks(newEbooks);
        setNumberOfPages(data.number_of_pages);
      });
    } 
    else {
      EbookService.search(searchCriteria, props.sort, page, pageSize)
      .then((response) => {
        const data = response.data;
        const newEbooks: Ebook[] = data.result;
        setEbooks(newEbooks);
        setNumberOfPages(data.number_of_pages);
      });
    }
  }, [page]);

  return (
    <Grid item container direction="column" rowGap={8}>
      <Typography variant="h4" textAlign="center">
        {props.title}
      </Typography>
      {ebooks.length > 0 && (
        <Grid item container justifyContent="center" columnGap={2.5}>
          {page > 1 && (
            <Grid item alignSelf="start" marginTop={12}>
              <IconButton onClick={() => setPage(page - 1)}>
                <ChevronLeft fontSize="large" />
              </IconButton>
            </Grid>
          )}
          {ebooks
            .map((ebook: Ebook) => (
              <Grid key={ebook.id} item xs={2}>
                <BasicEbookView ebook={ebook} showAddToCart={true}/>
              </Grid>
            ))
          }
          {page < numberOfPages && (
            <Grid item alignSelf="start" marginTop={12}>
              <IconButton onClick={() => setPage(page + 1)}>
                <ChevronRight fontSize="large" />
              </IconButton>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default EbooksSlider;
