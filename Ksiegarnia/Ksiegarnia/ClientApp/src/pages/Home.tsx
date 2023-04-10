import { Search } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import CategoriesContent from "../layouts/CategoriesContent";
import EbooksSlider from "../components/EbooksSlider";
import { EbookSortOptions } from "../models/ebookSortOptions";
import { useEffect } from "react";

const Home = () => {

    return (
        <CategoriesContent>
            <Grid item container direction="column" rowGap={8} marginTop={2}>
                <EbooksSlider title="Nowości" sort={EbookSortOptions[EbookSortOptions.DescByDate]}/>
                <EbooksSlider title="Promocje" sort={EbookSortOptions[EbookSortOptions.DescByDate]}/>
                <EbooksSlider title="Bestsellery" sort={EbookSortOptions[EbookSortOptions.DescByDate]}/>
                <EbooksSlider title="Najlepsze książki 2022 roku" sort={EbookSortOptions[EbookSortOptions.DescByDate]}/>
            </Grid>
        </CategoriesContent>
    )
}

export default Home;