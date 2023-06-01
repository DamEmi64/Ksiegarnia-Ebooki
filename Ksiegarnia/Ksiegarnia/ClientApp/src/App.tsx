import { Outlet, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./index.css";
import "./App.css";
import React from "react";
import Header from "./layouts/header/Header";
import Footer from "./layouts/Footer";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline, Grid } from "@mui/material";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import SearchEbooks from "./pages/SearchEbooks";
import UserProvider from "./context/UserContext";
import AccountSettings from "./pages/AccountSettings";
import AccountDetails from "./features/account-settings/account-details/AccountDetails";
import BasketProvider from "./context/BasketContext";
import Basket from "./features/transaction/Basket";
import Contact from "./pages/Contact";
import Regulamin from "./pages/Regulamin";
import axios from "axios";
import Content from "./layouts/Content";
import Navbar from "./layouts/Navbar";
import EbookDetails from "./features/ebook-details/EBookDetails";
import { plPL as corePlPL } from '@mui/material/locale';
import { plPL } from '@mui/x-date-pickers/locales';
import EbooksNotifications from "./features/account-settings/admin/EbooksNotifications";
import UsersManagement from "./features/account-settings/admin/UsersManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import NotificationProvider from "./context/NotificationContext";
import TransactionsHistory from "./features/account-settings/TransactionsHistory";
import AuthorsPanel from "./features/account-settings/normal-user/authors-panel/AuthorsPanel";
import CreateEbook from "./features/account-settings/normal-user/authors-panel/manage-ebook/CreateEbook";
import EditEbook from "./features/account-settings/normal-user/authors-panel/manage-ebook/EditEbook";
import EbookContentViewer from "./features/account-settings/normal-user/owned-ebooks/EbookContentViewer";
import OwnedEbooks from "./features/account-settings/normal-user/owned-ebooks/OwnedEbooks";
import PremiumAccount from "./features/account-settings/normal-user/premium-account/PremiumAccount";
import Notification from "./components/Notification";
import Forbidden from "./pages/Forbidden";
import Logout from "./features/account-settings/Logout";

axios.defaults.withCredentials = true;
axios.defaults.headers['Content-Type'] = "application/json"

const theme = createTheme(
  {
    palette: {
      primary: {
        main: "#0A3F5C",
        dark: "#1470a3",
      },
      secondary: {
        main: "#EB4B36",
      },
      info: {
        main: "#87CEEB",
      },
      success: {
        main: "#10CE00",
      },
    },
    typography: {
      fontSize: 13,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      button: {
        textTransform: "none",
      },
    },
  },
  corePlPL,
  plPL
);

const ContextProviders = (props: { children: React.ReactNode }) => {
  return (
    <NotificationProvider>
      <UserProvider>
        <BasketProvider>{props.children}</BasketProvider>
      </UserProvider>
    </NotificationProvider>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ContextProviders>
        <Grid container direction="column" justifyContent="center">
          <Header />
          <Navbar />
          <Content>
            <Routes>
              <Route index path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <ProtectedRoute requiresLogged={false}>
                    <Login />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRoute requiresLogged={false}>
                    <Register />
                  </ProtectedRoute>
                }
              />
              <Route path="/Ebook/:id" element={<EbookDetails />} />
              <Route path="/ebooks" element={<SearchEbooks />} />
              <Route
                path="/account-settings"
                element={
                  <ProtectedRoute requiresLogged={true}>
                    <AccountSettings />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AccountDetails />} />
                <Route path="details" element={<AccountDetails />} />
                <Route path="authors-panel" element={<AuthorsPanel />} />
                <Route path="owned-ebooks" element={<Outlet />}>
                  <Route index element={<OwnedEbooks />} />
                  <Route path=":id" element={<EbookContentViewer />} />
                </Route>
                <Route path="transactions" element={<TransactionsHistory />} />
                <Route path="premium" element={<PremiumAccount />} />
                <Route path="users-managment" element={<UsersManagement />} />
                <Route path="ebooks-notifications" element={<EbooksNotifications />} />
                <Route path="logout" element={<Logout />} />
              </Route>
              <Route
                path="/ebook/create"
                element={
                  <ProtectedRoute requiresLogged={true}>
                    <CreateEbook />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ebook/:id/edit"
                element={
                  <ProtectedRoute requiresLogged={true}>
                    <EditEbook />
                  </ProtectedRoute>
                }
              />
              <Route path="/transaction" element={<Outlet />}>
                <Route index element={<Basket />} />
              </Route>
              <Route path="contact" element={<Contact />} />
              <Route path="regulamin" element={<Regulamin />} />
              <Route path="forbidden" element={<Forbidden />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Content>
          <Footer />
        </Grid>
        <Notification />
      </ContextProviders>
    </ThemeProvider>
  );
}

export default App;
