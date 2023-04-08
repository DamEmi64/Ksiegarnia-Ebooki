import { Grid, Link, Typography } from "@mui/material";
import { LinkProps } from "../models/linkProps";

const links: string[] = ["Ebooki", "Nowości", "Promocje", "Bestsellery", "Kontakt", "Regulamin"]

const Navbar = () => {
    return (
        <nav>
            <Grid container justifyContent="center" columnGap={5} className="links-panel">
                {links.map((link: string, index: number) => (
                    <Typography key={index} variant="h6" component={Link} href={link}>
                        {link}
                    </Typography>
                ))}
            </Grid>
        </nav>
    )
}

export default Navbar;