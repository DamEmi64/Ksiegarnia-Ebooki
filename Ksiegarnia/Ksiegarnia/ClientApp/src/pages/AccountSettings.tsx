import { Grid, Typography } from "@mui/material";
import LinksSidePanel from "../layouts/LinksSidePanel";
import Navbar from "../layouts/Navbar";
import { LinkProps } from "../models/linkProps";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

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
    url: "premium",
  },
];

const AccountSettings = () => {
  const location = useLocation();

  const [subPath, setSubPath] = useState<string | undefined>("");

  useEffect(() => {
    const lastPart = location.pathname.split("/").pop();
    const foundSubPageName = links.filter((path: LinkProps) => (
      path.url === lastPart
    ));
    setSubPath(foundSubPageName.length == 1 ? foundSubPageName[0].title : links[0].title);
  }, [location]);

  return (
    <Grid container>
      <LinksSidePanel title="Konto" links={links} />
      <Grid item xs={10} container direction="column" alignItems="stretch" rowGap={8}>
        <Grid item container justifyContent="center">
          <Navbar />
        </Grid>
        <Grid item container justifyContent="center" alignItems="stretch" rowGap={10}>
          <Typography variant="h4" textAlign="center">{subPath}</Typography>
          <Outlet />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AccountSettings;
