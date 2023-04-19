import { Grid, Typography } from "@mui/material";
import Statistics from "../../../models/api/statistics";

const StatisticData = (props: { title: string; value: string }) => {
  return (
    <Grid
      item
      xs={5}
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
};

const AuthorsStatistics = () => {
  return (
    <Grid item container direction="column" rowGap={6}>
      <Typography variant="h5" fontWeight="bold">
        Statystyki twórcy:
      </Typography>
      <Grid item container justifyContent="center">
        <Grid item xs={10} container direction="column" rowGap={4}>
          <Grid item container justifyContent="space-between">
            <StatisticData
              title="Liczba dodanych książek:"
              value={stats.createdEbooks.toString()}
            />
            <StatisticData
              title="Przychód ze wszystkich książek:"
              value={stats.profit.toString() + "zł"}
            />
          </Grid>
          <Grid item container justifyContent="space-between">
            <StatisticData
              title="Liczba odbiorców:"
              value={stats.numberOfReceivers.toString()}
            />
            <StatisticData
              title="Średni przychód na książkę:"
              value={stats.profitPerEbook.toString() + "zł"}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AuthorsStatistics;
