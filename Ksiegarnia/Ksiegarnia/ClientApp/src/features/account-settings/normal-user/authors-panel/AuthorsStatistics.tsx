import { Grid, Typography } from "@mui/material";
import Statistics from "../../../../models/api/statistics";
import React from "react";
import TransactionService from "../../../../services/TransactionService";
import { UserContext } from "../../../../context/UserContext";
import axios from "axios";
import UserService from "../../../../services/UserService";

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

interface UserTransactionsStats {
  numberOfSoldEbooks: number;
  earnedCash: number;
  earnedCashPerEbook: number;
  numberOfAddedEbooks: number;
  numberOfDistinctions: number
}

const AuthorsStatistics = () => {
  const userContext = React.useContext(UserContext);
  const userId = userContext?.user.data?.id;

  const [stats, setStats] = React.useState<UserTransactionsStats>({
    numberOfSoldEbooks: 0,
    earnedCash: 0,
    earnedCashPerEbook: 0,
    numberOfAddedEbooks: 0,
    numberOfDistinctions: 0
  });

  React.useEffect(() => {
    TransactionService.getUserStats(userId as string)
    .then((response) => {
      const rawStatistics: Statistics = response.data
      const numberOfSoldEbooks = rawStatistics.selled_book.all;
      setStats({
        numberOfSoldEbooks: numberOfSoldEbooks,
        numberOfDistinctions: userContext ? userContext.user.numberOfDistinctions : 0,
        earnedCash: rawStatistics.earned_cash,
        earnedCashPerEbook:
          numberOfSoldEbooks == 0
            ? numberOfSoldEbooks
            : rawStatistics.earned_cash / numberOfSoldEbooks,
        numberOfAddedEbooks: userContext ? userContext.user.numberOfAddedEbooks : 0
      });
    })
  }, []);

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
            title="Liczba odbiorców"
            value={stats?.numberOfSoldEbooks.toString()}
          />
          <StatisticData
            title="Łączny przychód z książek:"
            value={stats?.earnedCash.toString() + " zł"}
          />
          <StatisticData
            title="Średni przychód na książkę:"
            value={stats?.earnedCashPerEbook.toString() + " zł"}
          />
          {!userContext?.user.isPremium && (
            <StatisticData
              title="Pozostało książek do dodania:"
              value={(userContext?.user.numberOfAddedEbooks as number < 10
                ? 10 - (userContext?.user.numberOfAddedEbooks as number)
                : 0
              ).toString()}
            />
          )}
          <StatisticData
            title="Pozostało darmowych wyróżnień:"
            value={stats.numberOfDistinctions.toString()}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AuthorsStatistics;
