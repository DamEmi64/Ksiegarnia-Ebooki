﻿import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Link,
  Grid,
} from "@mui/material";
import React from "react";
import logo from "../../assets/logo.png";
import { UserContext } from "../../context/UserContext";
import AccountMenu from "./AccountMenu";
import MenuIcon from "@mui/icons-material/Menu";
import Cart from "./Cart";
import { useNavigate } from "react-router-dom";
import SearchEbooksByPhrase from "./SearchEbooksByPhrase";

const Header = () => {
  const isUserLogged = React.useContext(UserContext)?.user.logged;

  const WideScreenMenu = () => {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "none", lg: "flex" },
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <Link href="/">
          <img src={logo} height="55" width="197" />
        </Link>
        <Grid
          item
          container
          flexGrow={1}
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item lg={6} xl={7} marginLeft={6}>
            <SearchEbooksByPhrase />
          </Grid>
          <Grid
            item
            lg={5}
            xl={4}
            container
            justifyContent="end"
            alignItems="center"
            columnGap={3}
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
                  className="premium-button button-rounded"
                  variant="contained"
                  href="account-settings/premium"
                >
                  Premium
                </Button>
              </React.Fragment>
            )}
            <Cart />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const SmallScreenMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
      setAnchorEl(null);
    };

    return (
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "flex", lg: "none" },
          justifyContent: "end",
          alignItems: "center",
          flexDirection: "column",
          rowGap: 2,
        }}
      >
        <Grid item container justifyContent="space-between" alignItems="center">
          <Link href="/">
            <img src={logo} height="55" width="197" />
          </Link>
          <Cart />
        </Grid>
        <Grid
          item
          container
          flexGrow={1}
          justifyContent="space-around"
          alignItems="center"
          columnGap={2}
        >
          <Grid item flexGrow={1}>
            <SearchEbooksByPhrase />
          </Grid>
          {isUserLogged ? (
            <AccountMenu />
          ) : (
            <React.Fragment>
              <IconButton onClick={handleClick}>
                <MenuIcon fontSize="large" style={{ color: "white" }} />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
                <MenuItem key={1} onClick={() => navigate("/register")}>
                  Zarejestruj
                </MenuItem>
                <MenuItem key={2} onClick={() => navigate("/login")}>
                  Zaloguj się
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </Grid>
      </Box>
    );
  };

  return (
    <Grid item container position="sticky" top="0" zIndex="100">
      <AppBar
        position="static"
        color="secondary"
        style={{ padding: "20px 40px" }}
      >
        <Toolbar>
          <WideScreenMenu />
          <SmallScreenMenu />
        </Toolbar>
      </AppBar>
    </Grid>
  );
};

export default Header;
