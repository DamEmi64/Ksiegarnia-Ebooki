import {
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import RedAsterisk from "../../../components/RedAsterisk";
import Genre from "../../../models/api/genre";
import { NotificationStatus } from "../../../models/api/notificationStatus";
import React from "react";
import AdminService from "../../../services/AdminService";

interface StatusNameColorMapping {
  status: NotificationStatus;
  name: string;
  color: string;
}

const statusNameColorMappings: StatusNameColorMapping[] = [
  {
    status: NotificationStatus.Reported,
    name: "Utworzone",
    color: "orange",
  },
  {
    status: NotificationStatus.Aborted,
    name: "Przedawnione",
    color: "grey",
  },
  {
    status: NotificationStatus.Accepted,
    name: "Zaakceptowane",
    color: "yellow",
  },
  {
    status: NotificationStatus.Completed,
    name: "Ukończone",
    color: "#10CE00",
  },
  {
    status: NotificationStatus.Abandoned,
    name: "Porzucone",
    color: "#FF0000",
  },
];

const NotificationStatusSelector = (props: {
  notificationId: string;
  value: NotificationStatus;
}) => {
  const [status, setStatus] = React.useState<NotificationStatus>(
    props.value
  );

  const handleChange = (event: SelectChangeEvent) => {
    const newSelectedStatus: string = event.target.value;
    const enumStatus =
      NotificationStatus[
        newSelectedStatus as keyof typeof NotificationStatus
      ];

    return;

    AdminService.changeNotificationStatus(
      props.notificationId,
      enumStatus
    ).then(() => {
      setStatus(enumStatus);
    });
  };

  return (
    <Grid item container alignItems="center" justifyContent="space-between" columnGap={2}>
      <Grid item>
        <Typography variant="h6" display="inline" marginRight={2}>
          Status
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <Select value={status} onChange={handleChange}>
            {statusNameColorMappings.map(
              (statusMapping: StatusNameColorMapping, index: number) => (
                <MenuItem key={index} value={statusMapping.status}>
                  {statusMapping.name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default NotificationStatusSelector;
