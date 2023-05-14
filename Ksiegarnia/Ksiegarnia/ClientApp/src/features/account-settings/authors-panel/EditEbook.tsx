import { useNavigate, useParams } from "react-router-dom";
import CategoriesContent from "../../../layouts/CategoriesContent";
import Genre from "../../../models/api/genre";
import React, { useContext, useEffect, useState } from "react";
import EbookService from "../../../services/EbookService";
import Ebook from "../../../models/api/ebook";
import NotFound from "../../../pages/NotFound";
import { Grid, Typography, Button, IconButton } from "@mui/material";
import BasicTextField from "../../../components/BasicTextField";
import ChoosePicture from "../../../components/ChoosePicture";
import SelectEbookGenre from "../../../components/SelectEbookGenre";
import Image from "../../../components/Image";
import UserDTO from "../../../models/api/userDTO";
import { Close, Edit } from "@mui/icons-material";
import FormService from "../../../services/FormService";
import Loading from "../../../pages/Loading";
import { NotificationContext } from "../../../context/NotificationContext";

interface FormProps {
  title: string;
  genre: Genre;
  description: string;
  pageNumber: number;
  picture: string;
  prize: number;
}

interface FormErrors {
  title: string;
  genre: string;
  description: string;
  pageNumber: string;
  prize: string;
}

const initErrors: FormErrors = {
  title: "",
  genre: "",
  description: "",
  pageNumber: "",
  prize: "",
};

const EditableField = (props: {
  nonEditableLabel: string;
  nonEditableValue: string;
  children: React.ReactNode;
  valueProps?: any;
  placeEditAfterLabel?: boolean;
}) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const EditButton = () => {
    return (
      <IconButton
        onClick={() => setIsEditable(true)}
        style={{ marginBottom: 2 }}
      >
        <Edit />
      </IconButton>
    );
  };

  return (
    <React.Fragment>
      {!isEditable ? (
        <Grid item container alignItems="center">
          <Typography variant="h6" marginRight={1}>
            {props.nonEditableLabel}:
          </Typography>
          {props.placeEditAfterLabel && <EditButton />}
          <Typography variant="h6" fontWeight="bold" {...props.valueProps}>
            {props.nonEditableValue}
          </Typography>
          {!props.placeEditAfterLabel && <EditButton />}
        </Grid>
      ) : (
        <Grid item container alignItems="center">
          <Grid item xs={11}>
            {props.children}
          </Grid>
          <Grid item xs={1} marginTop={-2}>
            <IconButton onClick={() => setIsEditable(false)}>
              <Close />
            </IconButton>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
};

const EditEbook = () => {
  const ebookId: string = useParams().id as string;

  const notificationContext = useContext(NotificationContext)

  const [form, setForm] = useState<FormProps>();

  const [errors, setErrors] = useState<FormErrors>(initErrors);

  const navigate = useNavigate();

  const NOT_FOUND_BOOK = "Nie znaleziono takiej książki"
  const NOT_VERIFIED_BOOK = "Książka nie została jeszcze zweryfikowana"
  const SUCCESSFULY_EDITED_EBOOK = "Zmieniono dane książki" 

  let ebookAuthor: UserDTO;

  useEffect(() => {
    EbookService.getById(ebookId)
     .then((response) => {
      const gotEboot: Ebook = response.data;
      setForm(gotEboot);
      ebookAuthor = gotEboot.author;
    })
    .catch((error) => {
      console.log(error)
      navigate("/account-settings/authors-panel")
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: false,
        message: error.response.status == 406 ? NOT_VERIFIED_BOOK :  NOT_FOUND_BOOK
      })
    })
  }, []);

  if (!form?.title) {
    return <Loading />;
  }

  const validateForm = () => {
    let newErrors: FormErrors = { ...initErrors };

    let passedValidation = true;

    if (!FormService.checkIfIsRequired(form.title)) {
      passedValidation = false;
      newErrors.title = FormService.requiredMessage;
    }

    if (!form.genre) {
      passedValidation = false;
      newErrors.genre = FormService.requiredMessage;
    }

    if (!FormService.checkIfIsRequired(form.description)) {
      passedValidation = false;
      newErrors.description = FormService.requiredMessage;
    }

    if (
      !FormService.checkIfIsRequired(
        form.pageNumber ? form.pageNumber.toString() : undefined
      )
    ) {
      passedValidation = false;
      newErrors.pageNumber = FormService.requiredMessage;
    }

    if (
      !FormService.checkIfIsRequired(
        form.prize ? form.prize.toString() : undefined
      )
    ) {
      passedValidation = false;
      newErrors.prize = FormService.requiredMessage;
    }

    setErrors(newErrors);

    return passedValidation;
  };

  const handleUpdate = () => {
    if (!validateForm()) {
      return;
    }

    console.log({...form, author: ebookAuthor})

    EbookService.update(ebookId, { ...form, author: ebookAuthor })
    .then(() => {
      navigate("../account-settings/authors-panel");
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: true,
        message: SUCCESSFULY_EDITED_EBOOK
      })
    })
    .catch((error) => {
      console.log(error)
    })
  };

  return (
    <CategoriesContent>
      <Grid item container direction="column" rowGap={3}>
        <Grid item container columnGap={6}>
          <Grid
            item
            xs={3}
            container
            direction="column"
            alignItems="center"
            rowGap={2}
          >
            <Grid
              item
              container
              className="pointer"
              height="320px"
              width="220px"
              justifyContent="center"
              alignItems="center"
              border="1px solid black"
            >
              {form.picture && (
                <Image
                  alt={form.title}
                  src={form.picture}
                  style={{ maxWidth: "100%", width: "auto", height: "100%" }}
                />
              )}
              <ChoosePicture
                file={form.picture}
                handleSelectFile={(file: string) => {
                  setForm({ ...form, picture: file });
                }}
              />
            </Grid>
            <Typography>Sugerowane wymiary okładki: 320px / 220px</Typography>
          </Grid>
          <Grid item xs={4} container direction="column" rowGap={2}>
            <EditableField
              nonEditableLabel="Tytuł"
              nonEditableValue={form.title}
            >
              <BasicTextField
                label="Tytuł"
                value={form.title}
                isRequired={true}
                errorMessage={errors.title}
                handleChange={(value: string) => {
                  setForm({ ...form, title: value });
                  setErrors({ ...errors, title: "" });
                }}
                disableSpaceBetween={true}
                fullWidth={true}
                formSize={10}
              />
            </EditableField>
            <EditableField
              nonEditableLabel="Kategoria"
              nonEditableValue={form.genre.name}
            >
              <SelectEbookGenre
                label="Kategoria"
                selectedGenreId={form.genre.id}
                isRequired={true}
                errorMessage={errors.genre}
                formSize={6}
                handleOnChange={(genre: Genre) => {
                  setForm({ ...form, genre: genre });
                  setErrors({ ...errors, genre: "" });
                }}
              />
            </EditableField>
            <EditableField
              nonEditableLabel="Liczba stron"
              nonEditableValue={form.pageNumber.toString()}
            >
              <BasicTextField
                label="Liczba stron"
                value={form.pageNumber.toString()}
                settings={{
                  type: "number",
                  inputProps: {
                    min: 0,
                  },
                }}
                isRequired={true}
                errorMessage={errors.pageNumber}
                handleChange={(value: string) => {
                  setForm({ ...form, pageNumber: +value });
                  setErrors({ ...errors, pageNumber: "" });
                }}
                disableSpaceBetween={true}
                fullWidth={true}
                formSize={3}
              />
            </EditableField>
            <EditableField
              nonEditableLabel="Cena"
              nonEditableValue={form.prize.toString()}
            >
              <BasicTextField
                label="Cena"
                value={form.prize.toString()}
                settings={{
                  type: "number",
                  inputProps: {
                    min: 0,
                  },
                }}
                isRequired={true}
                errorMessage={errors.prize}
                handleChange={(value: string) => {
                  setForm({ ...form, prize: +value });
                  setErrors({ ...errors, prize: "" });
                }}
                disableSpaceBetween={true}
                fullWidth={true}
                formSize={3}
              />
            </EditableField>
          </Grid>
        </Grid>
        <Grid item>
          <EditableField
            nonEditableLabel="Opis"
            nonEditableValue={form.description}
            placeEditAfterLabel={true}
            valueProps={{
              fontWeight: "normal",
              width: "100%",
              marginTop: 1,
            }}
          >
            <BasicTextField
              label="Opis"
              value={form.description}
              settings={{
                multiline: true,
                rows: 20,
              }}
              isRequired={true}
              errorMessage={errors.description}
              handleChange={(value: string) => {
                setForm({ ...form, description: value });
                setErrors({ ...errors, description: "" });
              }}
              disableSpaceBetween={true}
              fullWidth={true}
              formSize={12}
            />
          </EditableField>
        </Grid>
        <Grid item container justifyContent="center" columnGap={8}>
          <Grid item xs={1}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={() => navigate("../account-settings/authors-panel")}
            >
              Anuluj
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Button fullWidth variant="contained" onClick={handleUpdate}>
              Zapisz
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </CategoriesContent>
  );
};

export default EditEbook;
