import { Grid, Paper, Typography } from "@mui/material";
import { LinkProps } from "../models/linkProps";
import React from "react";
import { Link } from "react-router-dom";

const LinksSidePanel = (props: { title: string; links: LinkProps[] }) => (
  <Grid item container justifyContent="stretch">
    <Paper
      style={{
        padding: "20px 20px 20px 20px",
        position: "fixed",
        zIndex: 100,
      }}
    >
      <Grid container direction="column" rowGap={2}>
        <Typography variant="h5">{props.title}</Typography>
        <Grid item container direction="column" className="links-panel">
          {props.links.map((link: LinkProps, index: number) => (
            <Typography
              key={index}
              component={Link}
              to={link.url}
              title={link.hint}
            >
              {link.title}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Paper>
  </Grid>
);

export default LinksSidePanel;
