import { Grid, Typography } from "@mui/material";
import Statistics from "../../../models/api/statistics";
import React from "react";

const StatisticData = (props: { title: string; value: string }) => {
  return (
    <Grid
      item
      xs={12}
      lg={5.5}
      xl={5}
      container
      justifyContent="space-between"
      borderBottom="1px solid silver"
    >
      <Typography variant="h6">{props.title}</Typography>
      <Typography variant="h5" fontWeight="bold">
        {props.value}
      </Typography>
    </Grid>
  );
};

const stats: Statistics = {
  createdEbooks: 20,
  profit: 1832,
  numberOfReceivers: 2000,
  profitPerEbook: 100,
  leftBooksToCreate: 7
};

const AuthorsStatistics = () => {
  return (
    <Grid item container direction="column" rowGap={6}>
      <Typography variant="h5" fontWeight="bold">
        Statystyki twórcy:
      </Typography>
      <Grid item container justifyContent="center">
        <Grid
          item
          xs={12}
          md={12}
          xl={10}
          container
          justifyContent="space-between"
          rowGap={4}
        >
          <StatisticData
            title="Liczba dodanych książek:"
            value={stats.createdEbooks.toString()}
          />
          <StatisticData
            title="Łączny przychód z książek:"
            value={stats.profit.toString() + "zł"}
          />
          <StatisticData
            title="Liczba odbiorców:"
            value={stats.numberOfReceivers.toString()}
          />
          <StatisticData
            title="Średni przychód na książkę:"
            value={stats.profitPerEbook.toString() + "zł"}
          />
          <StatisticData
            title="Pozostało książek do dodania:"
            value={stats.leftBooksToCreate.toString()}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AuthorsStatistics;
