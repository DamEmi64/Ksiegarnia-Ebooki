﻿import { Box, Button, Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import LinksSidePanel from "../layouts/LinksSidePanel";
import { LinkProps } from "../models/linkProps";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import { adminLinks, normalUserlinks } from "../layouts/header/AccountMenu";
import { UserContext } from "../context/UserContext";
import { Role } from "../models/api/role";
import { ArrowLeft } from "@mui/icons-material";

const AccountSettings = (props: {title: string, children: React.ReactNode}) => {

  const isUserAdmin = React.useContext(UserContext)?.containsRole(Role.Admin);
  const links: LinkProps[] = !isUserAdmin ? normalUserlinks : adminLinks;

  const WideScreenSidePanel = () => {
    return (
      <Box
        sx={{
          display: { xs: "none", lg: "flex", justifyContent: "start" },
        }}
      >
        <LinksSidePanel title="Panel" links={links} />
      </Box>
    );
  };

  const SmallScreenSidePanel = () => {
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
          display: {
            xs: "flex",
            lg: "none",
            justifyContent: "stretch",
            marginTop: 40,
            zIndex: 100,
          },
          position: "fixed",
        }}
      >
        <IconButton onClick={handleClick}>
          <ArrowLeft fontSize="large"/>
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          {[
            links.map((link: LinkProps, index: number) => (
              <MenuItem key={index} onClick={() => navigate(link.url)}>
                {link.title}
              </MenuItem>
            )),
          ]}
        </Menu>
      </Box>
    );
  };

  return (
    <Grid container justifyContent="stretch" columnGap={{md: 8}}>
      <Grid
        item
        xs={1}
        lg={1.5}
        container
        justifyContent="center"
        alignItems="start"
      >
        <SmallScreenSidePanel />
        <WideScreenSidePanel />
      </Grid>
      <Grid item container xs={10} md={9} justifyContent="center">
        <Grid
          item
          xs={11}
          container
          justifyContent="center"
          alignItems="stretch"
          alignContent="start"
          rowGap={8}
        >
          <Typography variant="h4" textAlign="center" marginTop={1}>
            {props.title}
          </Typography>
          {props.children}
        </Grid>
      </Grid>
      <Grid item xs={1} lg={1.5} display={{ xs: "flex", md: "none" }}></Grid>
    </Grid>
  );
};

export default AccountSettings;
