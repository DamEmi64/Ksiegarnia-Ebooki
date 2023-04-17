import { Grid, Link, Typography } from "@mui/material";
import { LinkProps } from "../models/linkProps";

const links: LinkProps[] = [
  {
    title: "Ebooki",
    url: "ebooks",
  },
  {
    title: "Nowości",
    url: "news",
  },
  {
    title: "Promocje",
    url: "promotions",
  },
  {
    title: "Bestsellery",
    url: "bestsellers",
  },
  {
    title: "Kontakt",
    url: "contact",
  },
  {
    title: "Regulamin",
    url: "regulamin",
  },
];

const Navbar = () => {
  return (
    <nav>
      <Grid
        container
        justifyContent="center"
        columnGap={5}
        className="links-panel"
      >
        {links.map((link: LinkProps, index: number) => (
          <Typography key={index} variant="h6" component={Link} href={link.url}>
            {link.title}
          </Typography>
        ))}
      </Grid>
    </nav>
  );
};

export default Navbar;
