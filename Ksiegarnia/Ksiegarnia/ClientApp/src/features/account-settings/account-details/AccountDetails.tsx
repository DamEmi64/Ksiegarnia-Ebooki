import { useContext, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import { Grid, Button, Typography } from "@mui/material";
import BasicTextField from "../../../components/BasicTextField";
import UserDTO from "../../../models/api/userDTO";
import React from "react";
import EditAccountDetails from "./EditAccountDetails";
import ViewAccountDetails from "./ViewAccountDetails";
import "../Account-settings.css"

const AccountDetails = () => {
  const userContext = useContext(UserContext);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  return (
    <Grid item container direction="column" alignItems="center" rowGap={6}>
      {!isEditMode ? (
        <ViewAccountDetails setIsEditMode={setIsEditMode} />
      ) : (
        <EditAccountDetails setIsEditMode={setIsEditMode} />
      )}
    </Grid>
  );
};

export default AccountDetails;
