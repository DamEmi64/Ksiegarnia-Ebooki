import { Grid } from "@mui/material";
import CategoriesContent from "../layouts/CategoriesContent";
import EbooksSlider from "../components/EbooksSlider";
import { EbookSortOptions } from "../models/ebookSortOptions";
import React from "react";

const Home = () => {
  const prevYear: number = new Date().getFullYear() - 1;

  return (
    <CategoriesContent>
      <Grid item container direction="column" rowGap={8} marginTop={2}>
        <EbooksSlider title="Nowości" sort={EbookSortOptions.DescByDate} />
        <EbooksSlider
          title="Promocje"
          ebookSearchCriteria={{ onlyOnPromotion: true }}
        />
        <EbooksSlider title="Bestsellery" sort={EbookSortOptions.BestSeller} />
        <EbooksSlider
          title={`Najlepsze książki ${prevYear} roku`}
          sort={EbookSortOptions.BestSeller}
          ebookSearchCriteria={{ year: prevYear }}
        />
      </Grid>
    </CategoriesContent>
  );
};

export default Home;

//<EbooksSlider title="Nowości" sort={EbookSortOptions[EbookSortOptions.DescByDate]}/>
//<EbooksSlider title="Promocje" ebookSearchCriteria={{onlyOnPromotion: true}}/>
