import { Grid, Typography, TextField, FormControl, FormHelperText } from "@mui/material";

const BasicTextField = (props: {
  label: string;
  value?: string;
  errorMessage?: string;
  settings?: any;
  handleChange: (value: string) => void;
}) => {
  return (
    <Grid item container justifyContent="space-between" alignItems="center">
      <Typography variant="h6" marginBottom={3}>{props.label}</Typography>
      <FormControl>
        <TextField
            {...props.settings}
            value={props.value ? props.value : ""}
            error={props.errorMessage}
            onChange={(event: any) => props.handleChange(event.target.value)}
        />
        <FormHelperText error>{props.errorMessage ? props.errorMessage : " "}</FormHelperText>
      </FormControl>
    </Grid>
  );
};

export default BasicTextField;
