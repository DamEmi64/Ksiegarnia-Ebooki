import { IconButton, Typography, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { LinkProps } from "../../models/linkProps";
import PersonIcon from "@mui/icons-material/Person";

export const normalUserlinks: LinkProps[] = [
  {
    title: "Dane konta",
    url: "details",
  },
  {
    title: "Zakupione ebooki",
    url: "owned-ebooks",
  },
  {
    title: "Historia zamówień",
    url: "transactions",
  },
  {
    title: "Panel twórcy",
    url: "authors-panel",
  },
  {
    title: "Konto premium",
    url: "premium",
  },
  {
    title: "Wyloguj",
    url: "logout",
  },
];

export const adminLinks: LinkProps[] = [
  {
    title: "Dane konta",
    url: "details",
  },
  {
    title: "Dane Użytkowników",
    url: "owned-ebooks",
  },
  {
    title: "Przegląd zgłoszeń",
    url: "owned-ebooks",
  },
  {
    title: "Wyloguj",
    url: "logout",
  },
]

const AccountMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAccountSettings = (url: string) => {
    handleCloseMenu();
    navigate(`/account-settings/${url}`);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClick}>
        <PersonIcon fontSize="large" style={{ color: "white" }} />
        <Typography variant="h6" color="white" display={{xs: "none", md: "block"}} marginLeft={2}>
          Panel
        </Typography>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        {normalUserlinks.map((link: LinkProps, index: number) => (
          <MenuItem key={index} onClick={() => handleAccountSettings(link.url)}>
            {link.title}
          </MenuItem>
      ))}
      </Menu>
    </React.Fragment>
  );
};

export default AccountMenu;
