import { Close, Done } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import PremiumHistory from "../../models/api/premiumHistory";

const StatisticData = (props: { title: string; value: React.ReactNode }) => {
  return (
    <Grid
      item
      xs={3}
      container
      justifyContent="space-between"
      borderBottom="1px solid silver"
    >
      <Typography variant="h6">{props.title}</Typography>
      {props.value}
    </Grid>
  );
};

const premiumHistories: PremiumHistory[] = [
  {
    id: "1",
    type: 1,
    fromDate: new Date().toLocaleDateString(),
    toDate: new Date().toLocaleDateString(),
    prize: 50,
  },
  {
    id: "2",
    type: 3,
    fromDate: new Date().toLocaleDateString(),
    toDate: new Date().toLocaleDateString(),
    prize: 100,
  },
  {
    id: "3",
    type: 6,
    fromDate: new Date().toLocaleDateString(),
    toDate: new Date().toLocaleDateString(),
    prize: 150,
  },
];

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

const PremiumAccount = () => {
  const [isPremiumAccount, setIsPremiumAccount] = useState<boolean>(false);

  const BenefitInfo = (props: { benefit: string }) => {
    return (
      <Grid item xs={5} container alignItems="center">
        {isPremiumAccount ? (
          <Done className="success" fontSize="large" />
        ) : (
          <Close className="error" />
        )}
        <Typography variant="h5" marginLeft={1} display="inline">
          {props.benefit}
        </Typography>
      </Grid>
    );
  };

  return (
    <Grid item marginTop={-4} container direction="column" rowGap={8}>
      <Grid item container direction="column" rowGap={2}>
        <Grid item container columnGap={2}>
          <StatisticData
            title="Status konta premium"
            value={
              isPremiumAccount ? (
                <Typography variant="h6" style={{ color: "#24FF00" }}>
                  Aktywny
                </Typography>
              ) : (
                <Typography variant="h6" style={{ color: "#EB4B36" }}>
                  Nieaktywny
                </Typography>
              )
            }
          />
          {isPremiumAccount ? (
            <Button className="premium-button" variant="contained">
              Przedłuż
            </Button>
          ) : (
            <Button
              className="premium-button"
              variant="contained"
              onClick={() => setIsPremiumAccount(true)}
            >
              Zakup
            </Button>
          )}
        </Grid>
        <Grid item container>
          <StatisticData
            title="Premium wygasa dnia"
            value={
              <Typography variant="h6">
                {new Date().toLocaleDateString()}
              </Typography>
            }
          />
        </Grid>
      </Grid>
      <Grid item container justifyContent="center">
        <Grid item xs={10} container direction="column" rowGap={2}>
          <Grid item container justifyContent="space-between">
            <BenefitInfo benefit="Zniżki na książki" />
            <BenefitInfo benefit="Nielimitowana ilość dodanych ebooków" />
          </Grid>
          <Grid item container justifyContent="space-between">
            <BenefitInfo benefit="Jedno wyróżnienie ebooka" />
            <BenefitInfo benefit="Nieograniczona pojemność na ebooka" />
          </Grid>
        </Grid>
      </Grid>
      <Grid item container justifyContent="center" marginTop={2}>
        <Grid item xs={8} container justifyContent="center" rowGap={2}>
          <Typography variant="h4" marginBottom={4}>
            Historia zakupu premium:
          </Typography>
          {premiumHistories.map((premiumHistory: PremiumHistory) => (
            <PremiumAccountOrder
              key={premiumHistory.id}
              premiumHistory={premiumHistory}
            />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PremiumAccount;
