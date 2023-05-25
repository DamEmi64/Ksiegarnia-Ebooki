import {
  Grid,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Ebook from "../models/api/ebook";
import BasicEbookView from "./BasicEbookView";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import EbookService from "../services/EbookService";
import { EbookSortOptions } from "../models/ebookSortOptions";
import EbookSearchCriteria from "../models/ebookSearchCriteria";
import { AxiosResponse } from "axios";
import PagedResponse from "../models/api/pagedResponse";
import useWindowResize from "./useWindowResize";

const EbooksSlider = (props: {
  title: string;
  ebookSearchCriteria?: EbookSearchCriteria;
  sort?: string;
}) => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSM = useMediaQuery(theme.breakpoints.up("sm"));
  const matchesMD = useMediaQuery(theme.breakpoints.up("md"));
  const matchesLG = useMediaQuery(theme.breakpoints.up("lg"));
  const matchesXL = useMediaQuery(theme.breakpoints.up("xl"));

  const initPageSize = () => {
    if (matchesXL) {
      return 4;
    }

    if (matchesLG) {
      return 3;
    }

    if (matchesMD) {
      return 2;
    }

    return 1;
  };

  const [pageSize, setPageSize] = useState<number>(initPageSize());

  const [page, setPage] = useState<number>(1);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);

  const [width] = useWindowResize();

  useEffect(() => {
    const newPageSize = initPageSize();
    if (pageSize !== newPageSize) {
      setPageSize(newPageSize);
    }
  }, [width]);

  useEffect(() => {
    const searchCriteria = props.ebookSearchCriteria;
    EbookService.search({
      ebookSearchCriteria: searchCriteria,
      sort: props.sort,
      page: page,
      pageSize: pageSize,
    }).then((response) => {
      const data: PagedResponse = response.data;
      const newEbooks: Ebook[] = data.result;
      setEbooks(newEbooks);
      setNumberOfPages(data.number_of_pages);
    });
  }, [page, pageSize]);

  if (ebooks.length == 0) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <Grid item container direction="column" rowGap={8}>
      <Typography variant="h4" textAlign="center">
        {props.title}
      </Typography>
      <Grid item container justifyContent="center" columnGap={2.5}>
        {page > 1 && (
          <Grid item alignSelf="start" marginTop={12}>
            <IconButton onClick={() => setPage(page - 1)}>
              <ChevronLeft fontSize="large" />
            </IconButton>
          </Grid>
        )}
        {ebooks.map((ebook: Ebook) => (
          <Grid key={ebook.id} item xs={10} md={5} lg={3} xl={2}>
            <BasicEbookView ebook={ebook} showAddToCart={true} />
          </Grid>
        ))}
        {page < numberOfPages && (
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
