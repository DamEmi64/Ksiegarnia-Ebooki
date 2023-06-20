import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { LinkProps } from "../models/linkProps";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { EbookSearchCategories } from "../models/ebookSearchCategories";

const links: LinkProps[] = [
  {
    title: "Ebooki",
    url: "ebooks",
  },
  {
    title: "Nowości",
    url: `ebooks?searchCategory=${EbookSearchCategories.News}`,
  },
  {
    title: "Promocje",
    url: `ebooks?searchCategory=${EbookSearchCategories.Promotion}`,
  },
  {
    title: "Bestsellery",
    url: `ebooks?searchCategory=${EbookSearchCategories.Bestseller}`,
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

  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickOnOption = (linkUrl: string) => {
    handleCloseMenu()
    navigate(`/${linkUrl}`)
  }

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
          <MenuItem key={index} onClick={() => handleClickOnOption(link.url)}>
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
          <Typography key={index} variant="h6" component={Link} to={link.url}>
            {link.title}
          </Typography>
        ))}
      </Grid>
    </Box>
  );
};

const Navbar = () => {
  return (
    <Grid item container justifyContent="center" padding="20px 0">
      <nav>
        <SmallScreenNavbar />
        <WideScreenNavbar />
      </nav>
    </Grid>
  );
};

export default Navbar;
