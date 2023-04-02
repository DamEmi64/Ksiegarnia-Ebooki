import { Grid, Link, Typography } from "@mui/material";
import { LinkProps } from "../models/linkProps";

const links: string[] = ["Ebooki", "Nowości", "Promocje", "Bestsellery", "Kontakt", "Regulamin"]

const Navbar = () => {
    return (
        <nav>
            <Grid container justifyContent="center" columnGap={5}>
                {links.map((link: string, index: number) => (
                    <Typography>
                        <Link key={index} href={link}>
                            {link}
                        </Link>
                    </Typography>
                ))}
            </Grid>
        </nav>
    )
}

export default Navbar;