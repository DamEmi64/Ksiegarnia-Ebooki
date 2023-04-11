import { Grid, Typography, TextField, FormControl, FormHelperText } from "@mui/material";
import RedAsterisk from "./RedAsterisk";

const BasicTextField = (props: {
  label: string;
  value?: string;
  errorMessage?: string;
  settings?: any;
  isRequired?: boolean;
  handleChange: (value: string) => void;
}) => {
  return (
    <Grid item container justifyContent="space-between" alignItems="center">
      <Grid item marginBottom={3}>
        <Typography variant="h6" display="inline" marginRight={0.5}>{props.label}</Typography>
        {props.isRequired && <RedAsterisk/>}  
      </Grid>
      <FormControl>
        <TextField
            {...props.settings}
            value={props.value ? props.value : ""}
            error={props.errorMessage != undefined && props.errorMessage !== ""}
            onChange={(event: any) => props.handleChange(event.target.value)}
        />
        <FormHelperText error>{props.errorMessage ? props.errorMessage : " "}</FormHelperText>
      </FormControl>
    </Grid>
  );
};

export default BasicTextField;
