import { Search } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import CategoriesContent from "../layouts/CategoriesContent";
import EbooksSlider from "../components/EbooksSlider";
import { EbookSortOptions } from "../models/ebookSortOptions";
import { useEffect } from "react";

const Home = () => {

    const prevYear: number = new Date().getFullYear() - 1

    return (
        <CategoriesContent>
            <Grid item container direction="column" rowGap={8} marginTop={2}>
                <EbooksSlider title="Nowości" sort={EbookSortOptions[EbookSortOptions.DescByDate]}/>
                <EbooksSlider title="Promocje" ebookSearchCriteria={{onlyOnPromotion: true}}/>
                <EbooksSlider title="Bestsellery" searchBestsellers={true}/>
                <EbooksSlider title={`Najlepsze książki ${prevYear} roku`} searchBestsellers={true} ebookSearchCriteria={{year: prevYear}}/>
            </Grid>
        </CategoriesContent>
    )
}

export default Home;