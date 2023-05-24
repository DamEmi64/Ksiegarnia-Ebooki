import { useEffect, useRef, useState } from "react";
import Ebook from "../../models/api/ebook";
import { Grid, Pagination, Stack } from "@mui/material";
import BasicEbookView from "../../components/BasicEbookView";
import EbookService, { SearchEbookProps } from "../../services/EbookService";
import PagedResponse from "../../models/api/pagedResponse";
import SortEbooks from "../../components/SortEbooks";
import SelectPageSize from "../../components/SelectPageSize";
import { useSearchParams } from "react-router-dom";
import EbookSearchCriteria from "../../models/ebookSearchCriteria";
import { EbookSearchCategories } from "../../models/ebookSearchCategories";
import { EbookSortOptions } from "../../models/ebookSortOptions";

const FoundEbooks = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  const [numberOfPages, setNumberOfPages] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchEbooksProps, setSearchEbooksProps] = useState<SearchEbookProps>({
    page: 1,
    pageSize: 12,
  })
  const actualEbooksProps = useRef<SearchEbookProps>(searchEbooksProps)

  let isSearchingBestsellers: boolean = false;

  useEffect(() => {
    const phraseFromParams = searchParams.get("phrase")
    const genreFromParams = searchParams.getAll("genre");
    const minPriceFromParams = searchParams.get("minPrice");
    const maxPriceFromParams = searchParams.get("maxPrice");
    const searchCategory = searchParams.get("searchCategory");
    const newSearchEbooksProps: SearchEbookProps = {
      ...searchEbooksProps, 
      ebookSearchCriteria: {
        phrase: phraseFromParams ? phraseFromParams : undefined,
        genre: genreFromParams ? genreFromParams : undefined,
        minPrize: minPriceFromParams ? (minPriceFromParams as unknown as number) : undefined,
        maxPrize: maxPriceFromParams ? (maxPriceFromParams as unknown as number) : undefined
      }
    }

    if(searchCategory){
      switch(searchCategory){
        case EbookSearchCategories.News:
          newSearchEbooksProps.sort = EbookSortOptions.DescByDate
          break;
        case EbookSearchCategories.Bestseller:
          isSearchingBestsellers = true;
          break;
        case EbookSearchCategories.Promotion:
          newSearchEbooksProps.ebookSearchCriteria!.onlyOnPromotion = true
          break;
      }
    }

    actualEbooksProps.current = newSearchEbooksProps
    setSearchEbooksProps(newSearchEbooksProps)
  }, [searchParams])

  useEffect(() => {
    handleSearch();
  }, [searchEbooksProps]);

  const handleSearch = () => {
    EbookService.search(actualEbooksProps.current)
    .then((response) => {
      const pagedResponse: PagedResponse = response.data;
      setEbooks(pagedResponse.result);
    });
  };

  const handleSelectPageSize = (newPageSize: number) => {
    actualEbooksProps.current.pageSize = newPageSize
    setSearchEbooksProps({...searchEbooksProps, pageSize: newPageSize});
  };

  const handleSetSort = (newSort: string) => {
    actualEbooksProps.current.sort = newSort
    setSearchEbooksProps({...searchEbooksProps, sort: newSort});
  };

  const handleSetPage = (event: any, newPage: number) => {
    actualEbooksProps.current.page = newPage
    setSearchEbooksProps({...searchEbooksProps, page: newPage});
  }

  const CustomPagination = () => {
    return (
      <Stack alignItems="center">
        <Pagination
          page={searchEbooksProps.page}
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
            sortValue={searchEbooksProps.sort ? searchEbooksProps.sort  : ""}
            handleSetSort={handleSetSort}
          />
        </Grid>
        <Grid item xs={12} lg={5} xl={4}>
          <SelectPageSize
            pageSize={searchEbooksProps.pageSize ? searchEbooksProps.pageSize  : 12}
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
