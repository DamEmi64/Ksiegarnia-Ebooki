import { Warning } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";

const NotFound = () => {
    return (
        <Grid item container alignSelf="end" justifyContent="center" alignItems="center">
            <Warning fontSize="large" style={{ color: "#EB4B36" }}/>
            <Typography variant="h4" marginLeft={2}>
                404: Nie znaleziono zasobu
            </Typography>
        </Grid>
    )
}

export default NotFound;