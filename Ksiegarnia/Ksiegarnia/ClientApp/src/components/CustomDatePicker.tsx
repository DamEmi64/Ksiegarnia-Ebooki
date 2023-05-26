import {
  FormControl,
  FormHelperText,
  Grid,
  GridSize,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import RedAsterisk from "./RedAsterisk";
import { Dayjs } from "dayjs";
import dayjs from 'dayjs';
import React from "react";

const CustomDatePicker = (props: {
  label: string;
  value?: Date;
  isRequired?: boolean;
  errorMessage?: string;
  settings?: any;
  formSize?: GridSize;
  onChange: (newValue: Date) => void;
}) => {
  return (
    <Grid
      item
      container
      justifyContent="space-between"
      alignItems="center"
      columnGap={2}
    >
      <Grid item marginBottom={3}>
        <Typography variant="h6" display="inline" marginRight={0.5}>
          {props.label}
        </Typography>
        {props.isRequired && <RedAsterisk />}
      </Grid>
      <Grid item xs={props.formSize ? props.formSize : 6}>
        <FormControl fullWidth>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              {...props.settings}
              fullWidth
              value={props.value === undefined ? null : dayjs(props.value)}
              onChange={(newValue: Dayjs | null) => {
                if(newValue){
                    props.onChange(newValue.toDate());
                }
              }}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  error={props.errorMessage != undefined && props.errorMessage !== ""}
                  color="secondary"
                />
              )}
            />
          </LocalizationProvider>
          <FormHelperText error>
            {props.errorMessage ? props.errorMessage : " "}
          </FormHelperText>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default CustomDatePicker;
