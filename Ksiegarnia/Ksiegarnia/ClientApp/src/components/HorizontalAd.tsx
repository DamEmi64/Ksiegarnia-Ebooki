import { Box } from "@mui/material";
import React, { useEffect } from "react";
import horizontalAdImage from "../assets/horizontal-ad.jpg";

const HorizontalAd = () => {
  return (
    <Box
      sx={{
        marginTop: {
          xs: 10,
        },
      }}
    >
      <a
        target="_blank"
        href="https://www.amazon.pl/b?_encoding=UTF8&tag=ebookworld0e-21&linkCode=ur2&linkId=2bbd9a62812fe48da4cf5e6faf300b21&camp=247&creative=1211&node=20657313031"
      >
        <img
          alt="Książki od amazona"
          src={horizontalAdImage}
          style={{ maxWidth: "100%", width: "auto", height: "100%" }}
        />
      </a>
    </Box>
  );
};

export default HorizontalAd;
