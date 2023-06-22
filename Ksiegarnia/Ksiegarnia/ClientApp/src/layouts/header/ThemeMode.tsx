import { Box, IconButton, useTheme } from "@mui/material";
import React from "react";
import { PreferencesContext } from "../../context/PreferencesContext";
import { DarkMode, LightMode } from "@mui/icons-material";

const ThemeMode = () => {
  const preferencesContext = React.useContext(PreferencesContext);
  const isDarkMode = preferencesContext?.preferences.isDarkMode;  

  return (
    <IconButton onClick={() => preferencesContext?.setIsDarkMode(!isDarkMode)}>
      {isDarkMode ? (
        <LightMode fontSize="large" htmlColor="yellow" />
      ) : (
        <DarkMode fontSize="large" htmlColor="darkblue" />
      )}
    </IconButton>
  );
};

export default ThemeMode;
