import Search from "@mui/icons-material/Search";
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
import TextField from "@mui/material/TextField";
import React from "react";
import logo from "../../assets/logo.png";
import {
  UserContext,
} from "../../context/UserContext";
import AccountMenu from "./AccountMenu";
import Cart from "./Cart";

const Header = () => {
  const isUserLogged = React.useContext(UserContext)?.user.logged;

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
            <Cart/>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
