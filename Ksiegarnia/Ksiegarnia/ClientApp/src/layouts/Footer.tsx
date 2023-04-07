import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import HiddenEmail from "../components/HiddenEmail";

const Footer = () => {
    return (
        <footer>
            <Grid container direction="column" marginBottom={5}>
                <Typography>
                    &copy; PWr 1991-2023
                </Typography>
                <Typography>
                    PWr.pl sp. z o.o.ul. Kościuszki 1c44-100 Gliwice
                </Typography>
                <Typography>
                    tel. (32) 230-98-63 e-mail: <HiddenEmail email={"mail"}/>@ebookpoint.pl
                </Typography>
                <Typography>
                    redakcja: <HiddenEmail email={"mail"}/>@ebookpoint.pl
                </Typography>
            </Grid>
        </footer>
    )
}

export default Footer;