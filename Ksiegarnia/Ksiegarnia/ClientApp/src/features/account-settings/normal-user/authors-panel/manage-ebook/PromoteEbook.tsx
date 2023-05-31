import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  Grid,
} from "@mui/material";
import React, { useState } from "react";
import BasicTextField from "../../../../../components/BasicTextField";
import FormService from "../../../../../services/FormService";
import CustomDatePicker from "../../../../../components/CustomDatePicker";
import CustomCheckbox from "../../../../../components/CustomCheckbox";
import EbookService, {
  CreatePromotion,
} from "../../../../../services/EbookService";

interface FormProps {
  startDate: Date;
  endDate: Date;
  prize: number;
  premiumPrize: number;
  isPremiumOnly: boolean;
}

interface ErrorsProps {
  prize: string;
  premiumPrize: string;
}

const initErrors: ErrorsProps = {
  prize: "",
  premiumPrize: "",
};

const PromoteEbook = (props: { ebookId: string; ebookPrize: number }) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const [form, setForm] = React.useState<FormProps>({
    startDate: new Date(),
    endDate: new Date(),
    prize: props.ebookPrize,
    premiumPrize: props.ebookPrize,
    isPremiumOnly: false,
  });

  const [errors, setErrors] = useState<ErrorsProps>({ ...initErrors });

  const handleClose = () => {
    setOpen(false);
  };

  const validateForm = () => {
    const newErrors: ErrorsProps = { ...initErrors };

    let passedValidation = true;

    if (form.prize == 0) {
      passedValidation = false;
      newErrors.prize = FormService.requiredMessage;
    }

    if (form.premiumPrize == 0) {
      passedValidation = false;
      newErrors.premiumPrize = FormService.requiredMessage;
    }

    return passedValidation;
  };

  const handlePromote = () => {
    if (!validateForm()) {
      return;
    }

    const request: CreatePromotion = {
      ...form,
      startDate: form.startDate.toISOString(),
      endDate: form.endDate.toISOString(),
    };

    EbookService.promote(props.ebookId, request)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      <Button
        fullWidth
        className="promotion"
        style={{ borderRadius: 10 }}
        onClick={() => setOpen(true)}
      >
        Ustal promocję
      </Button>
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
          Ustalenie promocji
        </DialogTitle>
        <DialogContent>
          <Grid item container justifyContent="center" marginBottom={3}>
            <Grid item xs={11} md={8} container rowGap={4}>
              <CustomDatePicker
                label="Od"
                value={form.startDate}
                onChange={(newValue: Date) => {
                  setForm({ ...form, startDate: newValue });
                }}
              />
              <CustomDatePicker
                label="Do"
                value={form.endDate}
                onChange={(newValue: Date) => {
                  setForm({ ...form, endDate: newValue });
                }}
              />
              <BasicTextField
                label="Cena"
                settings={{ type: "number" }}
                value={form.prize.toString()}
                errorMessage={errors.prize}
                handleChange={(value: string) => {
                  setForm({ ...form, prize: +value });
                  setErrors({ ...errors, prize: "" });
                }}
              />
              <BasicTextField
                label="Cena premium"
                settings={{ type: "number" }}
                value={form.premiumPrize.toString()}
                errorMessage={errors.premiumPrize}
                handleChange={(value: string) => {
                  setForm({ ...form, premiumPrize: +value });
                  setErrors({ ...errors, premiumPrize: "" });
                }}
              />
              <CustomCheckbox
                label="Tylko premium"
                value={form.isPremiumOnly}
                onChange={(newValue: boolean) =>
                  setForm({ ...form, isPremiumOnly: newValue })
                }
              />
              <Grid item container rowGap={2}>
                <Button
                  fullWidth
                  variant="contained"
                  className="premium-button"
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                  onClick={handlePromote}
                >
                  Zapisz
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default PromoteEbook;
