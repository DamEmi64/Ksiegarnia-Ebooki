import { Grid, Typography, FormControl, FormHelperText, GridSize } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import RedAsterisk from "./RedAsterisk";

const BasicPhoneInput = (props: {
  label: string;
  value?: string;
  errorMessage?: string;
  settings?: any;
  isRequired?: boolean;
  disableSpaceBetween?: boolean;
  fullWidth?: boolean;
  formSize?: GridSize;
  handleChange: (phone: string) => void;
}) => {
  return (
    <Grid
      item
      container
      justifyContent={props.disableSpaceBetween ? "start" : "space-between"}
      alignItems="center"
      columnGap={2}
    >
      <Grid item marginBottom={3}>
        <Typography variant="h6" display="inline">
          {props.label}
        </Typography>
        {props.isRequired && <RedAsterisk />}
      </Grid>
      <Grid item xs={props.formSize ? props.formSize : 6}>
        <FormControl fullWidth={true}>
          <PhoneInput
            placeholder="+12133734253"
            value={props.value}
            onChange={(value: any) => props.handleChange(value)}
          />
          <FormHelperText error>
            {props.errorMessage ? props.errorMessage : " "}
          </FormHelperText>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default BasicPhoneInput;
