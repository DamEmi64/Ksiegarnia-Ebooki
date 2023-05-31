import { Grid, Typography } from "@mui/material";
import PremiumHistory from "../../../../models/api/premiumHistory";
import React from "react";

const KeyValue = (props: { title: string; value: string }) => {
  return (
    <Typography variant="h5">
      {props.title} {props.value}
    </Typography>
  );
};

const PremiumAccountOrder = (props: { premiumHistory: PremiumHistory }) => {
  const premiumHistory: PremiumHistory = props.premiumHistory;

  return (
    <Grid
      item
      container
      justifyContent="center"
      border="1px solid #0A3F5C"
      padding={4}
      columnGap={1}
    >
      <KeyValue title="Premium " value={`${premiumHistory.type} msc,`} />
      <KeyValue title="od dnia " value={`${premiumHistory.fromDate},`} />
      <KeyValue title="do dnia " value={`${premiumHistory.toDate},`} />
      <KeyValue title="koszt " value={`${premiumHistory.prize} zł`} />
    </Grid>
  );
};

export default PremiumAccountOrder;
