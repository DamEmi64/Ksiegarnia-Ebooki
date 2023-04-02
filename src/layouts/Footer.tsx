import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer>
            <Grid container direction="column" marginBottom={5}>
                <Typography variant="h6">
                    &copy; PWr 1991-2023
                </Typography>
                <Typography variant="h6">
                    PWr.pl sp. z o.o.ul. Kościuszki 1c44-100 Gliwice
                </Typography>
                <Typography variant="h6">
                    tel. (32) 230-98-63e-mail: [wyświetl email]@ebookpoint.pl
                </Typography>
                <Typography variant="h6">
                    redakcja: [wyświetl email]@ebookpoint.pl
                </Typography>
            </Grid>
        </footer>
    )
}

export default Footer;