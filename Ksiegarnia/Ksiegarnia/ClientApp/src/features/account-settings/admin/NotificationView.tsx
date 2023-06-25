import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import Notification from "../../../models/api/notification";
import AdminService from "../../../services/AdminService";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../../pages/Loading";
import { NotificationStatus } from "../../../models/api/notificationStatus";
import { Role } from "../../../models/api/role";
import AccountSettings from "../../../pages/AccountSettings";
import NotificationStatusSelector from "./NotificationStatusSelector";

const Data = (props: { label: string; value: string }) => {
  return (
    <Grid item container justifyContent="space-between">
      <Grid item xs={6} container>
        <Typography
          variant="h6"
          display="inline"
          width="100%"
          textAlign="start"
        >
          {props.label}
        </Typography>
      </Grid>
      <Grid item xs={6} container>
        <Typography variant="h6" display="inline" width="100%" textAlign="end">
          {props.value}
        </Typography>
      </Grid>
    </Grid>
  );
};

const newDate = new Date().toISOString();

const NotificationView = () => {
  const notificationId = useParams().notificationId;

  const [notification, setNotification] = React.useState<Notification>();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!notificationId) {
      navigate("/not-found");
    }

    AdminService.getNotificationById(notificationId as string)
      .then((response) => {
        console.log(response.data)
        setNotification(response.data);
      })
      .catch(() => {
        navigate("/not-found");
      });
  }, []);

  if (!notification) {
    return <Loading />;
  }

  const isStatusEditable = () => {
    switch (notification.status) {
      case NotificationStatus.Reported:
      case NotificationStatus.Accepted:
        return true;
      default:
        return false;
    }
  };

  return (
    <AccountSettings
      title={`Zgłoszenie dotyczące ebooka`}
    >
      <Grid item container rowGap={8}>
        <Grid item xs={12} lg={4} container direction="column" rowGap={6}>
          {!isStatusEditable() ? (
            <Data label={"Status"} value={notification.status} />
          ) : (
            <NotificationStatusSelector
              notificationId={notification.id}
              value={notification.status}
            />
          )}
          <Data
            label={"Data utworzenia"}
            value={new Date(
              notification.creationDate
            ).toLocaleDateString()}
          />
          <Data
            label={"Data modyfikacji"}
            value={new Date(
              notification.statusChangeDate
            ).toLocaleDateString()}
          />
        </Grid>
        <Grid item container direction="column" rowGap={2}>
          <Typography variant="h5" marginBottom={2} fontWeight="bold">
            Opis
          </Typography>
          <Typography variant="h6">{notification.description}</Typography>
        </Grid>
        <Button
          variant="contained"
          href={`/Ebook/${notification.objectId}`}
          target="_blank"
          style={{marginTop: -12}}
        >
          Zgłoszony ebook  
        </Button>
      </Grid>
    </AccountSettings>
  );
};

export default NotificationView;
