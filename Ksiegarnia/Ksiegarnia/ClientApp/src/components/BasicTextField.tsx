import { Grid, Typography, TextField, FormControl, FormHelperText, GridSize } from "@mui/material";
import RedAsterisk from "./RedAsterisk";
import React from "react";

const BasicTextField = (props: {
  label: string;
  value?: string;
  errorMessage?: string;
  settings?: any;
  isRequired?: boolean;
  disableSpaceBetween?: boolean;
  fullWidth?: boolean;
  formSize?: GridSize;
  formInside?: React.ReactNode;
  handleChange?: (value: string) => void;
}) => {
  return (
    <Grid item container justifyContent={props.disableSpaceBetween ? "start" : "space-between"} alignItems="center" columnGap={2}>
      <Grid item marginBottom={3}>
        <Typography variant="h6" display="inline" >{props.label}</Typography>
        {props.isRequired && <RedAsterisk/>}  
      </Grid>
      <Grid item xs={props.formSize ? props.formSize : 6}>
        <FormControl fullWidth={true}>
          <TextField
              fullWidth
              {...props.settings}
              value={props.value ? props.value : ""}
              error={props.errorMessage != undefined && props.errorMessage !== ""}
              onChange={(event: any) => props.handleChange!(event.target.value)}
          >
            {props.formInside}
          </TextField>
          <FormHelperText error>{props.errorMessage ? props.errorMessage : " "}</FormHelperText>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default BasicTextField;
