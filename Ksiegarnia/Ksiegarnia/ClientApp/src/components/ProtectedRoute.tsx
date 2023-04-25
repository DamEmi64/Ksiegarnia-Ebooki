import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = (props: {
  requiresLogged: boolean;
  children: React.ReactNode;
}) => {
  const userContext = React.useContext(UserContext);

  if (props.requiresLogged) {
    if (!userContext?.user.logged) {
        return <Navigate to="/login" />
    }
  } 
  else if (props.requiresLogged == false && userContext?.user.logged) {
    return <Navigate to="/"  />
  }

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default ProtectedRoute;
