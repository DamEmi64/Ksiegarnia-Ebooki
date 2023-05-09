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
  Card,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import React from "react";
import logo from "../../assets/logo.png";
import { UserContext } from "../../context/UserContext";
import AccountMenu, { accountMenuLinks } from "./AccountMenu";
import MenuIcon from "@mui/icons-material/Menu";
import Cart from "./Cart";
import { LinkProps } from "../../models/linkProps";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import { NotificationContext } from "../../context/NotificationContext";

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
          columnGap: 4,
          marginRight: 4,
        }}
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
      </Box>
    );
  };

  const SmallScreenMenu = () => {
    const userContext = React.useContext(UserContext);
    const notificationContext = React.useContext(NotificationContext);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const SUCCESSFUL_LOGGOUT_MSG = "Wylogowano pomyślnie";
    const FAILED_LOGGOUT_MSG = "Nie udało się wylogować";

    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
      setAnchorEl(null);
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
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "flex", lg: "none" },
          justifyContent: "end",
          alignItems: "center",
          columnGap: 4,
          marginRight: 4,
        }}
      >
        <IconButton onClick={handleClick}>
          <MenuIcon fontSize="large" style={{ color: "white" }} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          {!isUserLogged
            ? [
                <MenuItem key={1} href="/register">Zarejestruj</MenuItem>,
                <MenuItem key={2} href="/login">Zaloguj się</MenuItem>,
              ]
            : [
                ...[
                  accountMenuLinks.map((link: LinkProps, index: number) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        handleCloseMenu();
                        navigate(`/account-settings/${link.url}`);
                      }}
                    >
                      {link.title}
                    </MenuItem>
                  )),
                  <MenuItem key={"l"} onClick={handleLogout}>Wyloguj</MenuItem>,
                ],
              ]}
        </Menu>
      </Box>
    );
  };

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
        <Grid
          item
          container
          flexGrow={1}
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item flexGrow={1} marginLeft={6}>
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
          <WideScreenMenu />
          <SmallScreenMenu />
          <Cart />
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
