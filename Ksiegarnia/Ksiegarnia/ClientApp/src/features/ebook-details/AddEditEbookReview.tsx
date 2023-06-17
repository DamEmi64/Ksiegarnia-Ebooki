import {
  Grid,
  FormControl,
  TextField,
  FormHelperText,
  Button,
} from "@mui/material";
import React, { useContext, useState } from "react";
import FormService from "../../services/FormService";
import Rate from "../../components/EbookRate";
import { MockReview } from "./EbooksReviews";
import Ebook from "../../models/api/ebook";
import ReviewService, { CreateEditReview } from "../../services/ReviewService";
import { UserContext } from "../../context/UserContext";
import Loading from "../../pages/Loading";
import { NotificationContext } from "../../context/NotificationContext";
import { Review } from "../../models/api/review";

interface FormProps {
  opinion: string;
  grade: number;
}

interface FormErrors {
  opinion: string;
  grade: string;
}

const initForm: FormProps = {
  opinion: "",
  grade: 0,
};

const initFormErrors: FormErrors = {
  opinion: "",
  grade: "",
};

const AddEditEbookReview = (props: {
  ebook: Ebook;
  review?: Review;
  handleUpdate: () => void;
  handleClose: () => void;
}) => {
  const userData = useContext(UserContext)?.user.data;

  const notificationContext = useContext(NotificationContext);

  const [form, setForm] = useState<FormProps>(
    props.review ? { ...props.review } : initForm
  );

  const [errors, setErrors] = useState<FormErrors>(initFormErrors);

  const SUCCESSFULLY_CREATED_MESSAGE = "Utworzono recenzję";
  const NOT_BOUGHT_MESSAGE = "Nie zakupiono tego ebooka"
  const FAILED_CREATED_MESSAGE = "Nie udało się utworzyć recenzji";
  const SUCCESSFULLY_EDITED_MESSAGE = "Zmieniono dane recenzji";
  const FAILED_EDITED_MESSAGE = "Nie udało się zmienić danych recenzji";

  const validateForm = () => {
    const newErrors: FormErrors = { ...initFormErrors };
    let succeeded = true;

    if (!FormService.checkIfIsRequired(form.opinion)) {
      newErrors.opinion = FormService.requiredMessage;
      succeeded = false;
    }

    if (form.grade == 0) {
      newErrors.grade = FormService.requiredMessage;
      succeeded = false;
    }

    setErrors(newErrors);

    return succeeded;
  };

  if (!userData) {
    return <Loading />;
  }

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const request: CreateEditReview = {
      date: new Date().toISOString(),
      book: props.ebook,
      reviewer: userData,
      opinion: form.opinion,
      grade: form.grade,
    };

    if (props.review) {
      ReviewService.update(props.review.id, request)
      .then((response) => {
        console.log(response)
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: true,
          message: SUCCESSFULLY_EDITED_MESSAGE,
        });
        props.handleUpdate();
        props.handleClose();
      })
      .catch((error) => {
        console.log(error)
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: false,
          message: FAILED_EDITED_MESSAGE,
        });
      });
    } 
    else {
      ReviewService.create(request)
      .then((response) => {
        console.log(response)
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: true,
          message: SUCCESSFULLY_CREATED_MESSAGE,
        });
        props.handleUpdate();
        props.handleClose();
      })
      .catch((error) => {
        console.log(error)
        if(error.response.status == 404){
          notificationContext?.setNotification({
            isVisible: true,
            isSuccessful: false,
            message: NOT_BOUGHT_MESSAGE,
          });
        }
        else{
          notificationContext?.setNotification({
            isVisible: true,
            isSuccessful: false,
            message: FAILED_CREATED_MESSAGE,
          });
        }
      });
    }
  };

  return (
    <Grid item container direction="column" rowGap={2} marginBottom={2}>
      <FormControl fullWidth={true}>
        <TextField
          fullWidth
          placeholder="Treść recenzji"
          multiline={true}
          rows={2}
          value={form.opinion}
          error={errors.opinion !== ""}
          onChange={(event: any) => {
            setForm({ ...form, opinion: event.target.value });
            setErrors({ ...errors, opinion: "" });
          }}
        />
        <FormHelperText error>
          {errors.opinion ? errors.opinion : " "}
        </FormHelperText>
      </FormControl>
      <FormControl fullWidth={true}>
        <Rate
          value={form.grade}
          editable={true}
          onChange={(newValue: number) => {
            setForm({ ...form, grade: newValue });
            setErrors({ ...errors, grade: "" });
          }}
        />
        <FormHelperText error>
          {errors.grade ? errors.grade : " "}
        </FormHelperText>
      </FormControl>
      <Grid item>
        <Button
          variant="contained"
          style={{ marginRight: 12 }}
          onClick={handleSave}
        >
          Zapisz
        </Button>
        <Button variant="contained" color="secondary" onClick={props.handleClose}>
          Anuluj
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddEditEbookReview;
