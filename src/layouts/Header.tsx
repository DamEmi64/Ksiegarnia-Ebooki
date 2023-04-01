﻿import Search from "@mui/icons-material/Search";
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
  Avatar,
  InputAdornment,
  Grid,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  const [logged, setLogged] = useState<boolean>(false);

  return (
    <AppBar
      position="static"
      color="secondary"
      style={{ padding: "20px 40px" }}
    >
      <Toolbar>
        <img src={logo} height="55" width="217" />
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
            {!logged ? (
              <React.Fragment>
                <Button variant="contained" color="info">
                  Zarejestruj
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setLogged(true)}
                >
                  Zaloguj się
                </Button>
              </React.Fragment>
            ) : (
              <IconButton>
                <PersonIcon fontSize="large" style={{ color: "white" }} />
                <Typography variant="h6" color="white" marginLeft={2}>
                    Konto
                </Typography>
              </IconButton>
            )}
            <IconButton>
              <ShoppingCartOutlined
                fontSize="large"
                style={{ color: "white" }}
              />
              <Stack marginLeft={2}>
                <Typography variant="h6" color="white">
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
