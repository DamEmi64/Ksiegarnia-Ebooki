import { Grid, LinearProgress, Stack, Typography } from "@mui/material";
import Rate from "../../components/EbookRate";
import React from "react";

const stats: number[] = [100, 80, 30, 50, 25];

const EbookGrades = () => {
  return (
    <Grid item marginTop={2} container justifyContent="space-evenly">
      <Grid item xs={5.5}>
        {stats.map((stat: number, index: number) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            marginBottom="16"
            columnGap={2}
          >
            <Typography variant="h5" display="inline">
              {5 - index}
            </Typography>
            <LinearProgress
              key={stat}
              variant="determinate"
              value={stat}
              style={{ width: "100%", height: 14, borderRadius: 12 }}
            />
          </Stack>
        ))}
      </Grid>
      <Grid
        item
        xs={3}
        sm={2}
        marginTop={-2}
        container
        direction="column"
        justifyContent="center"
        alignItems={{ xs: "center", sm: "center" }}
        rowGap={1}
      >
        <Typography variant="h4" fontWeight="bold">
          4,4
        </Typography>
        <Rate value={4.4} />
        <Typography variant="h6">16 opinii</Typography>
      </Grid>
    </Grid>
  );
};

export default EbookGrades;
