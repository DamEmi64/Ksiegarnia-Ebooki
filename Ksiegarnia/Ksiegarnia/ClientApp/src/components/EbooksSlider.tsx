import { Grid, Typography } from "@mui/material";
import Ebook from "../models/api/ebook";
import BasicEbookView from "./BasicEbookView";
import { useState } from "react";

const EbooksSlider = (props: {title: string, ebooks: Ebook[]}) => {

    const [page, setPage] = useState<number>(0)

    const pageSize = 5

    return (
        <Grid item container direction="column" rowGap={8}>
            <Typography variant="h4" textAlign="center">
                {props.title}
            </Typography>
            <Grid item container justifyContent="center" columnGap={6}>
                {props.ebooks.slice(page * pageSize, (page + 1)*pageSize).map((ebook: Ebook, index: number) => (
                    <Grid item xs={2}>
                        <BasicEbookView key={index} ebook={ebook}/>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    )
}

export default EbooksSlider;