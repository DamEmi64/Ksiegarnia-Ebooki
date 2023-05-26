import { Box, Button, Grid, Menu, MenuItem, Typography } from "@mui/material";
import LinksSidePanel from "../layouts/LinksSidePanel";
import { LinkProps } from "../models/linkProps";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";

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
  {
    title: "Wyloguj",
    url: "logout",
  },
];

const AccountSettings = () => {
  const location = useLocation();

  const [subPath, setSubPath] = useState<string | undefined>("");

  useEffect(() => {
    const lastPart = location.pathname.split("/").pop();
    const foundSubPageName = links.filter(
      (path: LinkProps) => path.url === lastPart
    );
    setSubPath(
      foundSubPageName.length == 1 ? foundSubPageName[0].title : links[0].title
    );
  }, [location]);

  const WideScreenSidePanel = () => {
    return (
      <Box
        sx={{
          display: { xs: "none", lg: "flex", justifyContent: "start" },
        }}
      >
        <LinksSidePanel title="Konto" links={links} />
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
            left: 20,
            zIndex: 100,
          },
          position: "fixed",
        }}
      >
        <Button
          variant="contained"
          onClick={handleClick}
          style={{ padding: "5px 20px" }}
        >
          <Typography variant="h5">Konto</Typography>
        </Button>
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
          rowGap={9}
        >
          <Typography variant="h4" textAlign="center">
            {subPath}
          </Typography>
          <Outlet />
        </Grid>
      </Grid>
      <Grid item xs={1} lg={1.5}></Grid>
    </Grid>
  );
};

export default AccountSettings;
