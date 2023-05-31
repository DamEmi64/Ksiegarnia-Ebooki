import {
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  FormHelperText,
} from "@mui/material";
import React from "react";

const CustomCheckbox = (props: {
  label: string;
  value?: boolean;
  errorMessage?: string;
  onChange: (newValue: boolean) => void;
}) => {
  return (
    <FormControl>
      <FormControlLabel
        label={props.label}
        componentsProps={{ typography: { variant: "h6" } }}
        control={
          <Checkbox
            value={props.value}
            onChange={(event: any, checked: boolean) => props.onChange(checked)}
          />
        }
      />
      <FormHelperText error>
        {props.errorMessage ? props.errorMessage : " "}
      </FormHelperText>
    </FormControl>
  );
};

export default CustomCheckbox;
