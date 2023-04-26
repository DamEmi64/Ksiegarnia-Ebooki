import { Grid, Typography, Button } from "@mui/material";
import React, { useContext } from "react";
import UserDTO from "../../../models/api/userDTO";
import { UserContext } from "../../../context/UserContext";
import Loading from "../../../pages/Loading";

const Data = (props: { label: string; value: string }) => {
  return (
    <React.Fragment>
      <Grid item xs={4} container>
        <Grid item xs={6}>
          <Typography variant="h6" display="inline">
            {props.label}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" display="inline">
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

  const user = useContext(UserContext)?.user.data

  if(!user){
    return <Loading/> 
  }

  return (
    <Grid item container direction="column" alignItems="center" rowGap={6}>
      <Grid item container justifyContent="center" columnGap={12}>
        <Data label={"Imię"} value={user.firstName} />
        <Data label={"Nazwisko"} value={user.lastName} />
      </Grid>
      <Grid item container justifyContent="center" columnGap={12}>
        <Data label={"E-mail"} value={user.email} />
        <Data label={"Pseudonim"} value={user.nick} />
      </Grid>
      <Grid item container justifyContent="center" columnGap={12}>
        <Data label={"Numer tel."} value={user.phone} />
        <Data label={"Wiek"} value={(user.age - 1970).toString()} />
      </Grid>
      <Button
        variant="contained"
        style={{ width: "16%", marginTop: 12 }}
        onClick={() => props.setIsEditMode(true)}
      >
        Edytuj
      </Button>
    </Grid>
  );
};

export default ViewAccountDetails;
