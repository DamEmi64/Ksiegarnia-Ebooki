import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Button,
  Typography,
} from "@mui/material";

interface PremiumPlan {
  duration: number;
  price: number;
}

const BuyPremiumDialog = (props: {
  open: boolean;
  handleDecline: () => void;
  handleAccept: () => void;
}) => {
  const premiumPlans: PremiumPlan[] = [
    {
      duration: 1,
      price: 49.99,
    },
    {
      duration: 3,
      price: 119.99,
    },
    {
      duration: 6,
      price: 259.99,
    },
    {
      duration: 12,
      price: 419.99,
    },
  ];

  const handleAccept = () => {
    props.handleAccept();
  };

  const PremiumPlanView = (props: { premiumPlan: PremiumPlan }) => {
    const premiumPlan = props.premiumPlan;

    return (
      <Grid item container justifyContent="center">
        <Grid item xs={7}>
          <Button
            fullWidth
            className="premium-button"
            onClick={() => handleAccept()}
            style={{ padding: "12px 16px" }}
          >
            <Grid container alignItems="center">
              <Grid item xs={6}>
                <Typography variant="h6" fontWeight={600}>
                  {premiumPlan.duration}{" "}
                  {premiumPlan.duration == 1
                    ? "miesiąc"
                    : premiumPlan.duration < 5
                        ? "miesiące"
                        : "miesięcy"
                  }
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  marginLeft={3}
                  color="white"
                  style={{
                    backgroundColor: "#0A3F5C",
                    padding: "2px 4px",
                    borderRadius: 16,
                  }}
                >
                  {premiumPlan.price} zł
                </Typography>
              </Grid>
            </Grid>
          </Button>
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={props.open}
      onClose={props.handleDecline}
      style={{ borderRadius: 12 }}
    >
      <DialogTitle
        variant="h4"
        textAlign="center"
        marginTop={2}
        marginBottom={3}
      >
        Wybierz plan premium
      </DialogTitle>
      <DialogContent>
        <Grid item marginBottom={2} container direction="column" rowGap={3}>
          {premiumPlans.map((premiumPlan: PremiumPlan) => (
            <PremiumPlanView
              key={premiumPlan.duration}
              premiumPlan={premiumPlan}
            />
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default BuyPremiumDialog;
