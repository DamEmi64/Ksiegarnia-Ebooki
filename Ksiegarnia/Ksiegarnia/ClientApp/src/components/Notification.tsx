import {
  Alert,
  Dialog,
  DialogTitle,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { NotificationContext, NotificationProps } from "../context/NotificationContext";

const Notification = () => {
  const notificationContext = useContext(NotificationContext);

  const notification = notificationContext?.notification

  const handleClose = () => {
    notificationContext?.setIsVisible(false);
  };

  return (
    <Snackbar
      open={notification?.isVisible}
      autoHideDuration={4000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={notification?.isSuccessful ? "success" : "error"}
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
