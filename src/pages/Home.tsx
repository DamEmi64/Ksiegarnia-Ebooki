import { Search } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import CategoriesContent from "../layouts/CategoriesContent";
import EbooksSlider from "../components/EbooksSlider";
import { EbookSortOptions } from "../models/ebookSortOptions";
import { useEffect } from "react";
import EbookService from "../services/EbookService";
import Ebook from "../models/api/ebook";

const ebooks: Ebook[] = [
    {
        id: "1",
        title: "Blizny",
        genre: {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "kryminał",
          description: "string"
        },
        description: "string",
        pageNumber: 0,
        content: "string",
        author: {
          id: "string",
          nick: "string",
          firstName: "Thomas",
          lastName: "Enger",
          email: "string",
          phone: "string"
        },
        picture: "string",
        prize: 0
    },
    {
        id: "1",
        title: "string",
        genre: {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "string",
          description: "string"
        },
        description: "string",
        pageNumber: 0,
        content: "string",
        author: {
          id: "string",
          nick: "string",
          firstName: "string",
          lastName: "string",
          email: "string",
          phone: "string"
        },
        picture: "string",
        prize: 0
    },
    {
        id: "1",
        title: "string",
        genre: {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "string",
          description: "string"
        },
        description: "string",
        pageNumber: 0,
        content: "string",
        author: {
          id: "string",
          nick: "string",
          firstName: "string",
          lastName: "string",
          email: "string",
          phone: "string"
        },
        picture: "string",
        prize: 0
    },
    {
        id: "1",
        title: "string",
        genre: {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "string",
          description: "string"
        },
        description: "string",
        pageNumber: 0,
        content: "string",
        author: {
          id: "string",
          nick: "string",
          firstName: "string",
          lastName: "string",
          email: "string",
          phone: "string"
        },
        picture: "string",
        prize: 0
    },
    {
        id: "1",
        title: "string",
        genre: {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "string",
          description: "string"
        },
        description: "string",
        pageNumber: 0,
        content: "string",
        author: {
          id: "string",
          nick: "string",
          firstName: "string",
          lastName: "string",
          email: "string",
          phone: "string"
        },
        picture: "string",
        prize: 0
    },
    {
        id: "1",
        title: "string",
        genre: {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          name: "string",
          description: "string"
        },
        description: "string",
        pageNumber: 0,
        content: "string",
        author: {
          id: "string",
          nick: "string",
          firstName: "string",
          lastName: "string",
          email: "string",
          phone: "string"
        },
        picture: "string",
        prize: 0
    }
]

const Home = () => {
    
    useEffect(() => {
        EbookService.search({}, EbookSortOptions[EbookSortOptions.DescByDate], 0)
        .then((response) => {
            console.log(response.data)
        })
    })

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