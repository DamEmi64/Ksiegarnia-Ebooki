import { useState } from "react";
import { Grid } from "@mui/material";
import React from "react";
import EditAccountDetails from "./EditAccountDetails";
import ViewAccountDetails from "./ViewAccountDetails";
import "../Account-settings.css";
import AccountSettings from "../../../pages/AccountSettings";

const AccountDetails = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  return (
    <AccountSettings title="Dane konta">
      <Grid item container direction="column" alignItems="center" rowGap={6}>
        {!isEditMode ? (
          <ViewAccountDetails setIsEditMode={setIsEditMode} />
        ) : (
          <EditAccountDetails setIsEditMode={setIsEditMode} />
        )}
      </Grid>
    </AccountSettings>
  );
};

export default AccountDetails;
