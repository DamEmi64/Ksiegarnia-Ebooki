import {
  Box,
  Grid,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { LinkProps } from "../models/linkProps";
import { accountMenuLinks } from "./header/AccountMenu";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

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

const SmallScreenNavbar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: {
          xs: "block",
          md: "none",
        },
      }}
    >
      <IconButton onClick={handleClick}>
        <MenuIcon fontSize="large" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        {links.map((link: LinkProps, index: number) => (
          <MenuItem key={index} onClick={() => navigate(`/${link.url}`)}>
            {link.title}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

const WideScreenNavbar = () => {
  return (
    <Box
      sx={{
        display: {
          xs: "none",
          md: "block",
        },
      }}
    >
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
    </Box>
  );
};

const Navbar = () => {
  return (
    <nav>
      <SmallScreenNavbar />
      <WideScreenNavbar />
    </nav>
  );
};

export default Navbar;
