import Search from "@mui/icons-material/Search";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import PersonIcon from "@mui/icons-material/Person";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Link,
  Avatar,
  InputAdornment,
  Grid,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import React from "react";
import { useState } from "react";
import logo from "../assets/logo.png";
import {
  UserContext,
  UserContextType,
  UserProps,
} from "../context/UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";
import UserService from "../services/UserService";
import { LinkProps } from "../models/linkProps";
import { BasketContext } from "../context/BasketContext";

const links: LinkProps[] = [
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
        {links.map((link: LinkProps, index: number) => (
          <MenuItem key={index} onClick={() => handleAccountSettings(link.url)}>{link.title}</MenuItem>
        ))}
        <MenuItem onClick={handleLogout}>Wyloguj</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

const Header = () => {
  const isUserLogged = React.useContext(UserContext)?.user.logged;
  const basketContext = React.useContext(BasketContext)?.basket

  const navigate = useNavigate()

  return (
    <AppBar
      position="static"
      color="secondary"
      style={{ padding: "20px 40px" }}
    >
      <Toolbar>
        <Link href="/">
          <img src={logo} height="55" width="217" />
        </Link>
        <Grid item container justifyContent="space-around" alignItems="center">
          <Grid item xs={6} marginLeft={6}>
            <TextField
              className="inputRounded"
              placeholder="Wpisz zagadnienie, tytuł lub autora"
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => console.log("AA")}>
                    <Search />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid
            item
            xs={5}
            container
            justifyContent="end"
            alignItems="center"
            columnGap={4}
          >
            {!isUserLogged ? (
              <React.Fragment>
                <Button variant="contained" color="info" href="/register">
                  Zarejestruj
                </Button>
                <Button variant="contained" color="primary" href="/login">
                  Zaloguj się
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <AccountMenu />
                <Button
                  className="premium-button"
                  variant="contained"
                  href="account-settings/premium"
                >
                  Premium
                </Button>
              </React.Fragment>
            )}
            <IconButton onClick={() => navigate("/transaction")}>
              <ShoppingCartOutlined
                fontSize="large"
                style={{ color: "white" }}
              />
              <Stack marginLeft={2}>
                <Typography variant="h6" color="white" textAlign="start">
                  {basketContext?.ebooks.length} szt
                </Typography>
                <Typography variant="h6" color="white">
                  {basketContext?.totalPrice} zł
                </Typography>
              </Stack>
            </IconButton>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
