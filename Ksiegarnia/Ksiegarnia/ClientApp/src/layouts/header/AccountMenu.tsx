import { IconButton, Typography, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../context/NotificationContext";
import { UserContext } from "../../context/UserContext";
import UserService from "../../services/UserService";
import { LinkProps } from "../../models/linkProps";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import PersonIcon from "@mui/icons-material/Person";

export const accountMenuLinks: LinkProps[] = [
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
];

const AccountMenu = () => {
  const userContext = React.useContext(UserContext);
  const notificationContext = React.useContext(NotificationContext);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const SUCCESSFUL_LOGGOUT_MSG = "Wylogowano pomyślnie";
  const FAILED_LOGGOUT_MSG = "Nie udało się wylogować";

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

  const handleLogout = () => {
    UserService.logout()
      .then(() => {
        handleCloseMenu();
        userContext?.setLogged(false);
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: true,
          message: SUCCESSFUL_LOGGOUT_MSG,
        });
      })
      .catch(() => {
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: false,
          message: FAILED_LOGGOUT_MSG,
        });
      });
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleClick}>
        <PersonIcon fontSize="large" style={{ color: "white" }} />
        <Typography variant="h6" color="white" marginLeft={2}>
          Konto
        </Typography>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        {accountMenuLinks.map((link: LinkProps, index: number) => (
          <MenuItem key={index} onClick={() => handleAccountSettings(link.url)}>
            {link.title}
          </MenuItem>
        ))}
        <MenuItem onClick={handleLogout}>Wyloguj</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default AccountMenu;
