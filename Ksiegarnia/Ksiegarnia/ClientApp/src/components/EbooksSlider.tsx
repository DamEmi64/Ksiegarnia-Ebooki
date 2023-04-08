import { Grid, IconButton, Paper, Typography } from "@mui/material";
import Ebook from "../models/api/ebook";
import BasicEbookView from "./BasicEbookView";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import EbookService from "../services/EbookService";
import { EbookSortOptions } from "../models/ebookSortOptions";
import EbookSearchCriteria from "../models/ebookSearchCriteria";

const EbooksSlider = (props: {
  title: string;
  ebookSearchCriteria?: EbookSearchCriteria;
  sort?: string;
}) => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  const pageSize = 5;
  const [page, setPage] = useState<number>(0);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);

  useEffect(() => {
    const searchCriteria = props.ebookSearchCriteria;
    EbookService.search(
      searchCriteria ? searchCriteria : {},
      props.sort ? props.sort : "",
      page
    ).then((response) => {
      const newEbooks: Ebook[] = response.data;
      setEbooks(newEbooks);
      setNumberOfPages(newEbooks.length / pageSize);
    });
  }, []);

  return (
    <Grid item container direction="column" rowGap={8}>
      <Typography variant="h4" textAlign="center">
        {props.title}
      </Typography>
      <Grid item container justifyContent="center" columnGap={2.5}>
        {page > 0 && (
          <Grid item alignSelf="start" marginTop={12}>
            <IconButton onClick={() => setPage(page - 1)}>
              <ChevronLeft fontSize="large" />
            </IconButton>
          </Grid>
        )}
        {ebooks
          .slice(page * pageSize, (page + 1) * pageSize)
          .map((ebook: Ebook, index: number) => (
            <Grid key={index} item xs={2}>
              <BasicEbookView ebook={ebook} />
            </Grid>
          ))}
        {page < numberOfPages - 1 && (
          <Grid item alignSelf="start" marginTop={12}>
            <IconButton onClick={() => setPage(page + 1)}>
              <ChevronRight fontSize="large" />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default EbooksSlider;
