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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { EbookSearchCategories } from "../models/ebookSearchCategories";

interface QueryParam {
  name: string;
  value: string;
}

interface ExtendedLinkProps {
  title: string;
  url: string;
  queryParams?: QueryParam[];
}

const links: ExtendedLinkProps[] = [
  {
    title: "Ebooki",
    url: "ebooks",
  },
  {
    title: "Nowości",
    url: `ebooks`,
    queryParams: [
      {
        name: "searchCategory",
        value: EbookSearchCategories.News,
      },
    ],
  },
  {
    title: "Promocje",
    url: `ebooks`,
    queryParams: [
      {
        name: "searchCategory",
        value: EbookSearchCategories.Promotion,
      },
    ],
  },
  {
    title: "Bestsellery",
    url: `ebooks`,
    queryParams: [
      {
        name: "searchCategory",
        value: EbookSearchCategories.Bestseller,
      },
    ],
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
  const [searchParams, setSearchParams] = useSearchParams();

  const getLinkWithQueryParams = (extendedLink: ExtendedLinkProps) => {

    if (extendedLink.queryParams) {
      extendedLink.queryParams.forEach((queryParam: QueryParam) =>
        searchParams.set(queryParam.name, queryParam.value)
      );
    }

    return `${extendedLink.url}?${searchParams.toString()}`;
  };

  const SmallScreenNavbar = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClickOnOption = (extendedLink: ExtendedLinkProps) => {
      const destinationLink = getLinkWithQueryParams(extendedLink);
      navigate(destinationLink);
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
          {links.map((link: ExtendedLinkProps, index: number) => (
            <MenuItem key={index} onClick={() => handleClickOnOption(link)}>
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
          {links.map((link: ExtendedLinkProps, index: number) => (
            <Typography
              key={index}
              variant="h6"
              component={Link}
              to={getLinkWithQueryParams(link)}
            >
              {link.title}
            </Typography>
          ))}
        </Grid>
      </Box>
    );
  };

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
