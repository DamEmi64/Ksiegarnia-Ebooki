import { Done, Close } from "@mui/icons-material";
import { Grid, Typography, Stack, Button } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../../context/UserContext";
import PremiumCheck from "../../../../models/api/premiumCheck";
import PremiumHistory from "../../../../models/api/premiumHistory";
import Loading from "../../../../pages/Loading";
import PremiumService from "../../../../services/PremiumService";
import BuyPremiumDialog from "./BuyPremiumDialog";
import PremiumAccountOrder from "./PremiumAccountOrder";
import React from "react";
import AccountSettings from "../../../../pages/AccountSettings";

const StatisticData = (props: { title: string; value: React.ReactNode }) => {
  return (
    <Grid
      item
      xs={8}
      lg={6}
      xl={4}
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

interface PremiumInfoProps {
  isActive: boolean;
  userId: string;
  buyDate?: Date;
  endDate?: Date;
}

const PremiumAccount = () => {
  const userId = useContext(UserContext)?.user.data?.id;

  const [premiumInfo, setPremiumInfo] = useState<PremiumInfoProps>();

  const [isVisibleBuyPremiumDialog, setIsVisibleBuyPremiumDialog] =
    useState<boolean>(false);

  const handleCheckPremium = () => {
    PremiumService.checkPremium(userId as string).then((response) => {
      const premiumInfoData: PremiumCheck = response.data;

      if (!premiumInfoData.isActive) {
        setPremiumInfo({
          ...premiumInfoData,
          buyDate: undefined,
          endDate: undefined,
        });
        return;
      }

      const buyDate = new Date(premiumInfoData.buyDate as string);
      const endDate = new Date(buyDate);
      endDate.setDate(buyDate.getDate() + premiumInfoData.days!);

      setPremiumInfo({
        ...premiumInfoData,
        buyDate: buyDate,
        endDate: endDate,
      });
    });
  };

  useEffect(() => {
    handleCheckPremium();
  }, []);

  if (!userId || !premiumInfo) {
    return <Loading />;
  }

  const handleBuyPremium = (numberOfDays: number) => {
    const newBuyDate = new Date();
    const newEndDate = premiumInfo.endDate
      ? premiumInfo.endDate
      : new Date(newBuyDate);
    newEndDate.setDate(newBuyDate.getDate() + numberOfDays);

    PremiumService.buyPremium({
      isActive: true,
      userId: userId,
      buyDate: newBuyDate.toISOString(),
      days: numberOfDays,
    })
      .then((response) => {
        console.log(response);
        setPremiumInfo({
          ...premiumInfo,
          isActive: true,
          buyDate: newBuyDate,
          endDate: newEndDate,
        });
        setIsVisibleBuyPremiumDialog(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const BenefitInfo = (props: { benefit: string }) => {
    return (
      <Grid item xs={12} lg={5} container alignItems="center">
        <Stack direction="row" alignItems="center">
          {premiumInfo?.isActive ? (
            <Done className="success" fontSize="large" />
          ) : (
            <Close className="error" fontSize="medium" />
          )}
          <Typography variant="h5" marginLeft={2} display="inline">
            {props.benefit}
          </Typography>
        </Stack>
      </Grid>
    );
  };

  return (
    <AccountSettings title="Konto premium">
      <Grid item marginTop={-4} container direction="column" rowGap={8}>
        <Grid item container direction="column" rowGap={2}>
          <Grid item container columnGap={2} rowGap={1}>
            <StatisticData
              title="Status premium"
              value={
                premiumInfo?.isActive ? (
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
            {premiumInfo?.isActive ? (
              <Button
                className="premium-button button-rounded"
                variant="contained"
                onClick={() => setIsVisibleBuyPremiumDialog(true)}
              >
                Przedłuż
              </Button>
            ) : (
              <Button
                className="premium-button button-rounded"
                variant="contained"
                onClick={() => setIsVisibleBuyPremiumDialog(true)}
              >
                Zakup
              </Button>
            )}
          </Grid>
          <Grid item container>
            <StatisticData
              title="Wygasa dnia"
              value={
                <Typography variant="h6">
                  {premiumInfo.isActive
                    ? premiumInfo.endDate!.toLocaleDateString()
                    : ""}
                </Typography>
              }
            />
          </Grid>
          <Grid item container>
            <StatisticData
              title="Ostatni zakup"
              value={
                <Typography variant="h6">
                  {premiumInfo.isActive
                    ? premiumInfo.buyDate!.toLocaleDateString()
                    : ""}
                </Typography>
              }
            />
          </Grid>
        </Grid>
        <Grid item container justifyContent="center">
          <Grid
            item
            xs={12}
            lg={10}
            container
            justifyContent="space-between"
            rowGap={2}
          >
            <BenefitInfo benefit="Zniżki na książki" />
            <BenefitInfo benefit="Nielimitowana liczba dodanych ebooków" />
            <BenefitInfo benefit="Darmowe wyróżnienia ebooka" />
            <BenefitInfo benefit="Nieograniczona pojemność na ebooka" />
          </Grid>
        </Grid>
        <BuyPremiumDialog
          open={isVisibleBuyPremiumDialog}
          handleAccept={handleBuyPremium}
          handleDecline={() => {
            setIsVisibleBuyPremiumDialog(false);
          }}
        />
      </Grid>
    </AccountSettings>
  );
};

export default PremiumAccount;
