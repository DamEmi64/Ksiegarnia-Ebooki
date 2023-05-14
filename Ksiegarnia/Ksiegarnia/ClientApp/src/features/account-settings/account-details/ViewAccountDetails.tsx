import { Grid, Typography, Button } from "@mui/material";
import React, { useContext } from "react";
import UserDTO from "../../../models/api/userDTO";
import { UserContext } from "../../../context/UserContext";
import Loading from "../../../pages/Loading";

const Data = (props: { label: string; value: string }) => {
  return (
    <React.Fragment>
      <Grid item xs={12} md={5.5} container justifyContent="space-between">
        <Grid item>
          <Typography variant="h6" display="inline" textAlign="end">
            {props.label}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" display="inline" textAlign="end">
            {props.value}
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const ViewAccountDetails = (props: {
  setIsEditMode: (isEditMode: boolean) => void;
}) => {
  const user = useContext(UserContext)?.user.data;

  if (!user) {
    return <Loading />;
  }

  return (
    <Grid item container justifyContent="center">
      <Grid
        item
        container
        justifyContent={{ xs: "center", md: "space-between" }}
        rowGap={6}
      >
        <Data label={"Imię"} value={user.firstName} />
        <Data label={"Nazwisko"} value={user.lastName} />
        <Data label={"E-mail"} value={user.email} />
        <Data label={"Pseudonim"} value={user.nick} />
        <Data label={"Numer tel."} value={user.phone} />
        <Data label={"Wiek"} value={(user.age - 1970).toString()} />
        <Grid item xs={12} container justifyContent="center"  marginTop={4}>
          <Button
            variant="contained"
            onClick={() => props.setIsEditMode(true)}
            style={{ padding: "6px 60px" }}
          >
            Edytuj
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ViewAccountDetails;
