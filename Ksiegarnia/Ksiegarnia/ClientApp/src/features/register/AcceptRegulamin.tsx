import { Close } from "@mui/icons-material";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import React from "react";

const AcceptRegulamin = (props: {
  value: boolean;
  errorMessage: string;
  onChange: (newValue: boolean) => void;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <FormControl>
        <FormControlLabel
          componentsProps={{ typography: { variant: "h6" } }}
          control={
            <Checkbox
              value={props.value}
              onChange={(event: any, checked: boolean) =>
                props.onChange(checked)
              }
            />
          }
          label={
            <React.Fragment>
              <Typography variant="h6" display="inline">
                Akceptuję regulamin sklepu internetowego
              </Typography>
              <Button
                onClick={() => setOpen(true)}
                style={{ display: "inline" }}
              >
                <Typography variant="h6" fontWeight="bold">
                  więcej
                </Typography>
              </Button>
            </React.Fragment>
          }
        />
        <FormHelperText error>
          {props.errorMessage ? props.errorMessage : " "}
        </FormHelperText>
      </FormControl>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        style={{ borderRadius: 12 }}
      >
        <IconButton
          onClick={handleClose}
          style={{ position: "absolute", right: 12, top: 12 }}
        >
          <Close fontSize="large" />
        </IconButton>
        <DialogTitle
          variant="h5"
          textAlign="center"
          marginTop={2}
          marginBottom={6}
        >
          Regulamin serwisu
        </DialogTitle>
        <DialogContent>
          <Grid item container justifyContent="center" marginBottom={6}>
            <Grid item xs={8}>
              <Typography variant="h6">
                1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default AcceptRegulamin;
