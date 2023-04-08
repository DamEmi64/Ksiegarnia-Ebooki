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
import NotFound from './pages/NotFound';

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
        <Grid container minHeight="100vh" direction="column" justifyContent="stretch">
          <Grid item container position="sticky" top="0" zIndex="100">
            <Header/>
          </Grid>
          <Grid item container flexGrow={2}>
            <Grid item xs={1} container justifyContent="center">
              <div style={{top: "50%", transform: "translate(0, -50%)", position: "fixed"}}>
                <SideAd/>
              </div>
            </Grid>
            <Grid item xs={10} container rowGap={10}>
              <Grid item xs={12}>
                <Content>
                  <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="*" element={<NotFound/>}/>
                  </Routes>
                </Content>
              </Grid>
              <Grid item xs={12} container alignItems="end">
                <Footer/>
              </Grid>
            </Grid>
            <Grid item xs={1} container justifyContent="center">
              <div style={{top: "50%", transform: "translate(0, -50%)", position: "fixed"}}>
                <SideAd/>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
