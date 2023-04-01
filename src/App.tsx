import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import "./index.css";
import './App.css';
import React from 'react';
import Header from './layouts/Header';
import Content from './layouts/Content';
import Footer from './layouts/Footer';
import { ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline, makeStyles } from '@mui/material';

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
        <Header/>
        <Content>
          <Routes>
            <Route path="/" element={<Home/>}/>
          </Routes>
        </Content>
        <Footer/>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
