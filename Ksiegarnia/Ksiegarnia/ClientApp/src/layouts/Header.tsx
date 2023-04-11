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
import { useNavigate } from "react-router-dom";

const AccountMenu = () => {
  const userContext = React.useContext(UserContext);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAccountSettings = () => {
    handleCloseMenu();
    navigate("/account-settings")
  }

  const handleLogout = () => {
    handleCloseMenu();
    userContext?.setLogged(false);
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
        <MenuItem onClick={handleAccountSettings}>Panel użytkownika</MenuItem>
        <MenuItem onClick={handleLogout}>Wyloguj</MenuItem>
      </Menu>
    </React.Fragment>
  );
};

const Header = () => {
  const user = React.useContext(UserContext)?.user;

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
            {!user?.logged ? (
              <React.Fragment>
                <Button variant="contained" color="info" href="/register">
                  Zarejestruj
                </Button>
                <Button variant="contained" color="primary" href="/login">
                  Zaloguj się
                </Button>
              </React.Fragment>
            ) : (
              <AccountMenu />
            )}
            <AccountMenu />
            <IconButton>
              <ShoppingCartOutlined
                fontSize="large"
                style={{ color: "white" }}
              />
              <Stack marginLeft={2}>
                <Typography variant="h6" color="white" textAlign="start">
                  199 szt.
                </Typography>
                <Typography variant="h6" color="white">
                  244,99 zł
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
