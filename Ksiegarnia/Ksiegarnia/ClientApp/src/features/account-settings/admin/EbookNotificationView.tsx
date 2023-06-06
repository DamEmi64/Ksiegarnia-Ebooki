import { Grid, Typography } from "@mui/material";
import React from "react";
import EbookNotification from "../../../models/api/ebookNotification";
import AdminService from "../../../services/AdminService";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../pages/Loading";

const Data = (props: { label: string; value: string }) => {
  return (
    <React.Fragment>
      <Grid item xs={12} md={5} container justifyContent="space-between">
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
          <Typography
            variant="h6"
            display="inline"
            width="100%"
            textAlign="end"
          >
            {props.value}
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const EbookNotificationView = () => {
  const ebookNotificationId = useParams().ebookNotificationId;

  const [ebookNotification, setEbookNotification] =
    React.useState<EbookNotification>();

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!ebookNotificationId) {
      navigate("/not-found");
    }

    AdminService.getNotificationById(ebookNotificationId as string)
    .then((response) => {
        setEbookNotification(response.data);
    })
    .catch(() => {
      navigate("/not-found");
    })
  }, []);

  if (!ebookNotification) {
    return <Loading />;
  }

  return (
    <Grid item container justifyContent="center" rowGap={8}>
      <Grid
        item
        xs={12}
        lg={11}
        container
        justifyContent={{ xs: "center", md: "space-between" }}
        rowGap={6}
      >
        <Data label={"Status"} value={ebookNotification.status} />
      </Grid>
    </Grid>
  );
};

export default EbookNotificationView;
