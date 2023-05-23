import { useEffect, useState } from "react";
import Ebook from "../../models/api/ebook";
import { Grid, Pagination, Stack } from "@mui/material";
import BasicEbookView from "../../components/BasicEbookView";
import EbookService from "../../services/EbookService";
import PagedResponse from "../../models/api/pagedResponse";
import SortEbooks from "../../components/SortEbooks";
import SelectPageSize from "../../components/SelectPageSize";
import { useSearchParams } from "react-router-dom";
import EbookSearchCriteria from "../../models/ebookSearchCriteria";

const FoundEbooks = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [sort, setSort] = useState<string | undefined>(undefined);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchCriteria, setSearchCriteria] = useState<EbookSearchCriteria>({})

  useEffect(() => {
    const phraseFromParams = searchParams.get("phrase")
    const genreFromParams = searchParams.getAll("genre");
    const minPriceFromParams = searchParams.get("minPrice");
    const maxPriceFromParams = searchParams.get("maxPrice");

    const newSearchCriteria = {
      phrase: phraseFromParams ? phraseFromParams : undefined,
      genre: genreFromParams ? genreFromParams : undefined,
      minPrize: minPriceFromParams ? (minPriceFromParams as unknown as number) : undefined,
      maxPrize: maxPriceFromParams ? (maxPriceFromParams as unknown as number) : undefined
    }

    setSearchCriteria(newSearchCriteria)
  }, [searchParams])

  useEffect(() => {
    handleSearch();
  }, [page, pageSize, sort, searchCriteria]);

  const handleSearch = () => {
    console.log({
      ebookSearchCriteria: searchCriteria,
      sort: sort,
      page: page,
      pageSize: pageSize,
    })
    EbookService.search({
      ebookSearchCriteria: searchCriteria,
      sort: sort,
      page: page,
      pageSize: pageSize,
    }).then((response) => {
      const pagedResponse: PagedResponse = response.data;
      setEbooks(pagedResponse.result);
    });
  };

  const handleSelectPageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handleSetSort = (newSort: string) => {
    setSort(newSort);
  };

  const handleSetPage = (event: any, newPage: number) => {
    setPage(newPage)
  }

  const CustomPagination = () => {
    return (
      <Stack alignItems="center">
        <Pagination
          page={page}
          count={numberOfPages}
          onChange={handleSetPage}
          color="primary"
          shape="rounded"
          size="large"
        />
      </Stack>
    );
  };

  return (
    <Grid item container justifyContent="center" rowGap={6}>
      <Grid item container justifyContent="space-between" rowGap={4}>
        <Grid item xs={12} lg={5} xl={4}>
          <SortEbooks
            sortValue={sort ? sort : ""}
            handleSetSort={handleSetSort}
          />
        </Grid>
        <Grid item xs={12} lg={5} xl={4}>
          <SelectPageSize
            pageSize={pageSize}
            handleSetPageSize={handleSelectPageSize}
          />
        </Grid>
      </Grid>
      {numberOfPages > 0 && <CustomPagination />}
      <Grid
        item
        container
        rowGap={4}
        justifyContent={{ xs: "center", md: "start" }}
      >
        {ebooks.map((ebook: Ebook) => (
          <Grid
            key={ebook.id}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2.4}
            container
            justifyContent="center"
          >
            <Grid item xs={11}>
              <BasicEbookView
                key={ebook.id}
                ebook={ebook}
                showAddToCart={true}
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
      {numberOfPages > 0 && <CustomPagination />}
    </Grid>
  );
};

export default FoundEbooks;
