import { Grid, Typography } from "@mui/material";
import { EbookAcceptance } from "../models/api/ebookAcceptance";
import React from "react";

export interface EbookStatusNameColorMapping {
  status: EbookAcceptance;
  name: string;
  color: string;
}

export const ebookStatusesNameColorMappings: EbookStatusNameColorMapping[] = [
  {
    status: EbookAcceptance.Accepted,
    name: "Zaakceptowane",
    color: "#10CE00",
  },
  {
    status: EbookAcceptance.Verifing,
    name: "W trakcie weryfikacji",
    color: "orange",
  },
  {
    status: EbookAcceptance.Rejected,
    name: "Odrzucone",
    color: "FF0000",
  },
];

const EbookStatus = (props: { verificationStatus: EbookAcceptance }) => {
  return (
    <Grid item container columnGap={2}>
      <Typography variant="h5" display="inline">
        Status:
      </Typography>
      {ebookStatusesNameColorMappings
        .filter(
          (statusMapping: EbookStatusNameColorMapping) =>
            statusMapping.status === props.verificationStatus
        )
        .map((statusMapping: EbookStatusNameColorMapping) => (
          <Typography key={statusMapping.name} variant="h5" color={statusMapping.color} display="inline">
            {statusMapping.name}
          </Typography>
        ))}
    </Grid>
  );
};

export default EbookStatus;
