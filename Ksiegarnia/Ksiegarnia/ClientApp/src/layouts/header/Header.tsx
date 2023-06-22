import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import logo from "../../assets/logo.png";
import { UserContext } from "../../context/UserContext";
import AccountMenu from "./AccountMenu";
import MenuIcon from "@mui/icons-material/Menu";
import Cart from "./Cart";
import { Link, useNavigate } from "react-router-dom";
import SearchEbooksByPhrase from "./SearchEbooksByPhrase";
import { ArrowDownward, ExpandMore } from "@mui/icons-material";
import ThemeMode from "./ThemeMode";
import ChangeFontSize from "./ChangeFontSize";

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
        paddingLeft={{lg: "30px", xl: "40px"}}
        paddingRight={{lg: "30px", xl: "40px"}}
      >
        <Link to="/">
          <img src={logo} height="55" width="197" />
        </Link>
        <Grid
          item
          container
          flexGrow={1}
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item lg={4.5} xl={6} marginLeft={{lg: 3, xl: 6}}>
            <SearchEbooksByPhrase />
          </Grid>
          <Grid
            item
            lg={6.7}
            xl={5.5}
            container
            justifyContent="end"
            alignItems="center"
            columnGap={{lg: 1.5, xl: 3}}
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
                >
                  <Typography
                    component={Link}
                    to="account-settings/premium"
                    fontWeight="bold"
                    fontSize={13}
                  >
                    Premium
                  </Typography>
                </Button>
              </React.Fragment>
            )}
            <Cart />
            <ChangeFontSize />
            <ThemeMode />
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
          <Link to="/">
            <img src={logo} height="42" width="150" />
          </Link>
          <Grid item xs={5} container justifyContent="end" columnGap={2}>
            <Cart />
            <ChangeFontSize/>
            <ThemeMode/>
          </Grid>
        </Grid>
        <Grid
          item
          container
          flexGrow={1}
          justifyContent="space-around"
          alignItems="center"
          columnGap={2}
          rowGap={2}
        >
          <Grid item xs={9}>
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
        style={{ padding: "20px 20px" }}
      >
        <Toolbar disableGutters>
          <WideScreenMenu />
          <SmallScreenMenu />
        </Toolbar>
      </AppBar>
    </Grid>
  );
};

export default Header;
