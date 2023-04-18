import {
  Grid,
  Typography,
  FormControl,
  TextField,
  FormHelperText,
} from "@mui/material";
import RedAsterisk from "./RedAsterisk";
import { useState } from "react";

const ChooseFile = (props: {
  label: string;
  errorMessage?: string;
  isRequired?: boolean;
  handleSelectFile: (file: string) => void;
}) => {
  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = function () {
        const gotFile: string = reader.result as string;
        props.handleSelectFile(gotFile);
      };
      reader.readAsBinaryString(event.target.files[0]);
    }
  };
  return (
    <Grid item container alignItems="center" columnGap={2}>
      <Grid item marginTop={-2} >
        <Typography variant="h6" display="inline" marginRight={0.5}>
          {props.label}
        </Typography>
        {props.isRequired && <RedAsterisk />}
      </Grid>
      <Grid item>
        <FormControl>
          <input
            className="pointer"
            type="file"
            accept="application/pdf"
            onChange={handleSelectFile}
          />
          <FormHelperText error>
            {props.errorMessage ? props.errorMessage : " "}
          </FormHelperText>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default ChooseFile;
