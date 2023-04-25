import { Grid, Typography } from "@mui/material";

const Loading = () => {
    return(
        <Grid item container justifyContent="center" alignItems="center" rowGap={6}>
            <Typography variant="h4">
                Ładowanie...
            </Typography>
        </Grid>
    )
}

export default Loading;