import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import React from "react";

const ConfirmationDialog = (props: {
  message: string;
  open: boolean;
  handleDecline: () => void;
  handleAccept: () => void;
}) => {
  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={props.open}
      onClose={props.handleDecline}
      style={{ borderRadius: 12 }}
    >
      <DialogTitle
        variant="h5"
        textAlign="center"
        marginTop={2}
        marginBottom={3}
      >
        {props.message}
      </DialogTitle>
      <DialogContent>
        <Grid item marginBottom={2} container justifyContent="space-evenly">
          <Grid item xs={2}>
            <Button fullWidth variant="contained" onClick={props.handleDecline}>
              Nie
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={props.handleAccept}
            >
              Tak
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
