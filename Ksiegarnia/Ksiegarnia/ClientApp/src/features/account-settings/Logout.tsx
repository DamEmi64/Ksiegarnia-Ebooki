import React from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { NotificationContext } from "../../context/NotificationContext";
import { UserContext } from "../../context/UserContext";
import UserService from "../../services/UserService";

const Logout = () => {
  const userContext = React.useContext(UserContext);
  const notificationContext = React.useContext(NotificationContext);

  const SUCCESSFUL_LOGGOUT_MSG = "Wylogowano pomyślnie";
  const FAILED_LOGGOUT_MSG = "Nie udało się wylogować";

  useEffect(() => {
    UserService.logout()
      .then(() => {
        userContext?.setLogged(false);
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: true,
          message: SUCCESSFUL_LOGGOUT_MSG,
        });
      })
      .catch(() => {
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: false,
          message: FAILED_LOGGOUT_MSG,
        });
      });
  });

  return <Navigate to="/" />;
};

export default Logout;
