import { Box, IconButton } from "@mui/material";
import React from "react";
import { PreferencesContext } from "../../context/PreferencesContext";
import { TextDecrease, TextIncrease } from "@mui/icons-material";

const ChangeFontSize = () => {
  const preferencesContext = React.useContext(PreferencesContext);
  const fontSize = preferencesContext?.preferences.fontSize;

  return (
    <Box display={{ xs: "none", sm: "flex", alignItems: "center" }}>
      <IconButton
        onClick={() =>
          preferencesContext?.setFontSize(fontSize == 13 ? 18 : 13)
        }
      >
        {fontSize == 13 ? (
          <TextIncrease fontSize="large" htmlColor="white" />
        ) : (
          <TextDecrease fontSize="large" htmlColor="white" />
        )}
      </IconButton>
    </Box>
  );
};

export default ChangeFontSize;
