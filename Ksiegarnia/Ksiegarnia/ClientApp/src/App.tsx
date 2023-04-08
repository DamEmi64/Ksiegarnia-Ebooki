import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import "./index.css";
import './App.css';
import React from 'react';
import Header from './layouts/Header';
import Content from './layouts/Content';
import Footer from './layouts/Footer';
import { ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline, Grid, makeStyles } from '@mui/material';
import SideAd from './layouts/SideAd';
import Login from './pages/Login';
import Register from './pages/Register';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0A3F5C',
      dark: '#1470a3'
    },
    secondary: {
      main: '#EB4B36',
    },
    info: {
      main: '#87CEEB'
    }
  },
  typography: {
    fontSize: 13,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    button: {
      textTransform: 'none'
    }
  },
});

function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Grid container minHeight="100%" direction="column" justifyContent="stretch">
          <Grid item container justifySelf="start">
            <Header/>
          </Grid>
          <Grid item container flexGrow={2}>
            <Grid item xs={1} container justifyContent="center" alignItems="center">
              <SideAd/>
            </Grid>
            <Grid item xs={10} container direction="column" justifyContent="space-between">
              <Grid item>
                <Content>
                  <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                  </Routes>
                </Content>
              </Grid>
              <Grid item>
                <Footer/>
              </Grid>
            </Grid>
            <Grid item xs={1} container justifyContent="center" alignItems="center">
              <SideAd/>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
