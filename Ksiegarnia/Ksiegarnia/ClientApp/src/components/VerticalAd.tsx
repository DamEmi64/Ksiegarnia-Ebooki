import React, { useEffect } from "react";
import adImage from "../assets/vertical-ad.jpg";
import { Box, Grid } from "@mui/material";

const VerticalAd = () => {
  return (
    <Box
        sx={{
          display: {
            xs: "none",
            xl: "flex",
            justifyContent: "center",
          },
        }}
      >
        <a
      target="_blank"
      href="https://www.amazon.pl/b?_encoding=UTF8&tag=ebookworld0e-21&linkCode=ur2&linkId=2bbd9a62812fe48da4cf5e6faf300b21&camp=247&creative=1211&node=20657313031"
    >
      <img alt="Książki od amazona" src={adImage} style={{ objectFit: "cover" }}/>
    </a>
      </Box>
  );
};

export default VerticalAd;
