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
import EbookService from "../../../../../services/EbookService";
import { Promotion } from "../../../../../models/api/promotion";
import dayjs, { Dayjs } from "dayjs";
import { NotificationContext } from "../../../../../context/NotificationContext";

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

const PromoteEbook = (props: {
  ebookId: string;
  ebookPrize: number;
  ebookPromotion?: Promotion;
  update: () => void;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const [form, setForm] = React.useState<FormProps>({
    startDate: new Date(),
    endDate: new Date(),
    prize: props.ebookPrize,
    premiumPrize: props.ebookPrize,
    isPremiumOnly: false,
  });

  const [errors, setErrors] = useState<ErrorsProps>({ ...initErrors });

  const notificationContext = React.useContext(NotificationContext);

  const SUCCESSFULY_MESSAGE = "Utworzono promocję";

  const handleClose = () => {
    setOpen(false);
  };

  const validateForm = () => {
    const newErrors: ErrorsProps = { ...initErrors };

    let passedValidation = true;

    if (form.prize <= 0) {
      passedValidation = false;
      newErrors.prize = FormService.requiredMessage;
    }
    else if(form.prize >= props.ebookPrize){
      passedValidation = false;
      newErrors.prize = "Promocja powinna obniżyć cenę";
    }

    if (form.premiumPrize <= 0) {
      passedValidation = false;
      newErrors.premiumPrize = FormService.requiredMessage;
    }
    else if(form.prize >= props.ebookPrize){
      passedValidation = false;
      newErrors.prize = "Promocja powinna obniżyć cenę";
    } 
    else if (form.premiumPrize > form.prize) {
      passedValidation = false;
      newErrors.premiumPrize =
        "Cena dla promocji premium nie może być wyższa niż dla zwykłej promocji";
    }

    setErrors(newErrors);

    return passedValidation;
  };

  const handlePromote = () => {
    if (!validateForm()) {
      return;
    }

    const convertedStartedDate = new Date(form.startDate);
    convertedStartedDate.setHours(0, 0, 0, 0);

    const convertedEndDate = new Date(form.startDate);
    convertedEndDate.setHours(23, 59, 59, 99);

    const request: Promotion = {
      ...form,
      startDate: convertedStartedDate.toISOString(),
      endDate: convertedEndDate.toISOString(),
    };

    EbookService.promote(props.ebookId, request)
      .then((response) => {
        console.log(response);
        setOpen(false);
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: true,
          message: SUCCESSFULY_MESSAGE,
        });
        props.update();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deletePromotion = () => {
    EbookService.deletePromotion(props.ebookId)
      .then((response) => {
        console.log(response);
        props.update();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      {!(props.ebookPromotion && props.ebookPromotion.prize != 0) ? (
        <Button
          fullWidth
          className="promotion"
          style={{ borderRadius: 10 }}
          onClick={() => setOpen(true)}
        >
          Ustal promocję
        </Button>
      ) : (
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          style={{ borderRadius: 10 }}
          onClick={deletePromotion}
        >
          Usuń promocję
        </Button>
      )}
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
                settings={{ minDate: dayjs(), maxDate: dayjs(form.endDate) }}
                value={form.startDate}
                onChange={(newValue: Date) => {
                  setForm({ ...form, startDate: newValue });
                }}
              />
              <CustomDatePicker
                label="Do"
                settings={{ minDate: dayjs(form.startDate) }}
                value={form.endDate}
                onChange={(newValue: Date) => {
                  setForm({ ...form, endDate: newValue });
                }}
              />
              <BasicTextField
                label="Cena"
                settings={{
                  type: "number",
                  InputProps: { inputProps: { min: props.ebookPrize } },
                }}
                value={form.prize.toString()}
                errorMessage={errors.prize}
                handleChange={(value: string) => {
                  setForm({ ...form, prize: +value });
                  setErrors({ ...errors, prize: "" });
                }}
              />
              <BasicTextField
                label="Cena premium"
                settings={{
                  type: "number",
                  InputProps: {
                    inputProps: { min: props.ebookPrize, max: form.prize },
                  },
                }}
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
