import { IconButton, Typography, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { LinkProps } from "../../models/linkProps";
import PersonIcon from "@mui/icons-material/Person";
import { UserContext } from "../../context/UserContext";
import { Role } from "../../models/api/role";

export const normalUserlinks: LinkProps[] = [
  {
    title: "Dane konta",
    url: "/account-settings/details",
  },
  {
    title: "Zakupione ebooki",
    url: "/account-settings/owned-ebooks",
  },
  {
    title: "Historia zamówień",
    url: "/account-settings/transactions",
  },
  {
    title: "Panel twórcy",
    url: "/account-settings/authors-panel",
  },
  {
    title: "Konto premium",
    url: "/account-settings/premium",
  },
  {
    title: "Wyloguj",
    url: "/account-settings/logout",
  },
];

export const adminLinks: LinkProps[] = [
  {
    title: "Dane konta",
    url: "/account-settings/details",
  },
  {
    title: "Dane Użytkowników",
    url: "/account-settings/users-managment",
  },
  {
    title: "Weryfikacja ebooków",
    url: "/account-settings/ebooks-verification",
  },
  {
    title: "Przegląd zgłoszeń",
    url: "/account-settings/notifications",
  },
  {
    title: "Wyloguj",
    url: "/account-settings/logout",
  },
];

const AccountMenu = () => {
  const isUserAdmin = React.useContext(UserContext)?.containsRole(Role.Admin);
  const links: LinkProps[] = !isUserAdmin ? normalUserlinks : adminLinks;

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
    navigate(url);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClick}>
        <PersonIcon fontSize="large" style={{ color: "white" }} />
        <Typography
          variant="h6"
          color="white"
          display={{ xs: "none", md: "block" }}
          marginLeft={2}
        >
          Panel
        </Typography>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        {links.map((link: LinkProps, index: number) => (
          <MenuItem key={index} onClick={() => handleAccountSettings(link.url)}>
            {link.title}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
};

export default AccountMenu;
