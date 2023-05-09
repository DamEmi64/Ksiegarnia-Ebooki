import { Close, Done } from "@mui/icons-material";
import { Button, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import PremiumHistory from "../../../models/api/premiumHistory";
import PremiumAccountOrder from "./PremiumAccountOrder";
import BuyPremiumDialog from "./BuyPremiumDialog";
import { UserContext } from "../../../context/UserContext";
import PremiumService from "../../../services/PremiumService";
import PremiumCheck from "../../../models/api/premiumCheck";
import Loading from "../../../pages/Loading";

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
      let endDate = new Date(buyDate);
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
    let newEndDate = premiumInfo.endDate ? premiumInfo.endDate : new Date(newBuyDate);
    newEndDate.setDate(newBuyDate.getDate() + numberOfDays);

    setPremiumInfo({
      ...premiumInfo,
      isActive: true,
      buyDate: newBuyDate,
      endDate: newEndDate,
    });
    setIsVisibleBuyPremiumDialog(false);
  };

  const BenefitInfo = (props: { benefit: string }) => {
    return (
      <Grid item xs={5} container alignItems="center">
        {premiumInfo?.isActive ? (
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
              className="premium-button"
              variant="contained"
              onClick={() => setIsVisibleBuyPremiumDialog(true)}
            >
              Przedłuż
            </Button>
          ) : (
            <Button
              className="premium-button"
              variant="contained"
              onClick={() => setIsVisibleBuyPremiumDialog(true)}
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
                {premiumInfo.isActive
                  ? premiumInfo.endDate!.toLocaleDateString()
                  : ""}
              </Typography>
            }
          />
        </Grid>
        <Grid item container>
          <StatisticData
            title="Ostatnia data zakupu"
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
        <Grid item xs={10} container direction="column" rowGap={2}>
          <Grid item container justifyContent="space-between">
            <BenefitInfo benefit="Zniżki na książki" />
            <BenefitInfo benefit="Nielimitowana ilość dodanych ebooków" />
          </Grid>
          <Grid item container justifyContent="space-between">
            <BenefitInfo benefit="Darmowe wyróżnienia ebooka" />
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
      <BuyPremiumDialog
        open={isVisibleBuyPremiumDialog}
        handleAccept={handleBuyPremium}
        handleDecline={() => {
          setIsVisibleBuyPremiumDialog(false);
        }}
      />
    </Grid>
  );
};

export default PremiumAccount;
