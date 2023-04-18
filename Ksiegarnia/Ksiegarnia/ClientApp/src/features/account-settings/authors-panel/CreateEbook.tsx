﻿import { Button, Grid, IconButton, Typography } from "@mui/material";
import CategoriesContent from "../../../layouts/CategoriesContent";
import { useState } from "react";
import Ebook from "../../../models/api/ebook";
import { AddAPhoto } from "@mui/icons-material";
import Image from "../../../components/Image";
import ChoosePicture from "../../../components/ChoosePicture";
import Genre from "../../../models/api/genre";
import BasicTextField from "../../../components/BasicTextField";
import ChooseFile from "../../../components/ChooseFile";
import SelectEbookGenre from "../../../components/SelectEbookGenre";
import { useNavigate } from "react-router-dom";
import EbookService, { CreateEbookProps } from "../../../services/EbookService";

interface FormProps {
  title?: string;
  genre?: Genre;
  description?: string;
  pageNumber?: number;
  content?: string;
  picture?: string;
  prize?: number;
}

const CreateEbook = () => {
  const [form, setForm] = useState<FormProps>({});

  const navigate = useNavigate();

  const handleCreate = () => {
    /*EbookService.create({...form})
    .then(() => {
        navigate("../account-settings/authors-panel")
    })*/
    navigate("../account-settings/authors-panel")
  }

  return (
    <CategoriesContent>
      <Grid item container direction="column" rowGap={4}>
        <Grid item container columnGap={6}>
          <Grid item xs={3} container justifyContent="center" rowGap={1}>
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
              {form?.picture && (
                <Image
                  alt={form.title}
                  src={form.picture}
                  style={{ maxWidth: "100%", width: "auto", height: "100%" }}
                />
              )}
              <ChoosePicture
                file={form?.picture}
                handleSelectFile={(file: string) => {
                  setForm({ ...form, picture: file });
                }}
              />
            </Grid>
            <Typography>Sugerowane wymiary okładki: 320px / 220px</Typography>
          </Grid>
          <Grid item xs={4} container direction="column" rowGap={2}>
            <BasicTextField
              label="Tytuł"
              value={form.title}
              isRequired={true}
              handleChange={(value: string) =>
                setForm({ ...form, title: value })
              }
              disableSpaceBetween={true}
              fullWidth={true}
              formSize={10}
            />
            <ChooseFile
              label="Plik z ebookiem"
              file={form.content}
              isRequired={true}
              handleSelectFile={(file: string) => {
                setForm({ ...form, content: file });
              }}
            />
            <SelectEbookGenre
              label="Kategoria"
              selectedGenreId={form.genre?.id}
              isRequired={true}
              formSize={6}
              handleOnChange={(genre: Genre) => {
                setForm({ ...form, genre: genre });
              }}
            />
            <BasicTextField
              label="Liczba stron"
              value={form.pageNumber?.toString()}
              settings={{
                type: "number",
                inputProps: {
                  min: 0,
                },
              }}
              isRequired={true}
              handleChange={(value: string) =>
                setForm({ ...form, pageNumber: +value })
              }
              disableSpaceBetween={true}
              fullWidth={true}
              formSize={3}
            />
            <BasicTextField
              label="Cena"
              value={form.prize?.toString()}
              settings={{
                type: "number",
                inputProps: {
                  min: 0,
                },
              }}
              isRequired={true}
              handleChange={(value: string) =>
                setForm({ ...form, prize: +value })
              }
              disableSpaceBetween={true}
              fullWidth={true}
              formSize={3}
            />
          </Grid>
        </Grid>
        <Grid item>
          <BasicTextField
            label="Opis"
            value={form.description}
            settings={{
              multiline: true,
              rows: 20,
            }}
            isRequired={true}
            handleChange={(value: string) =>
              setForm({ ...form, description: value })
            }
            disableSpaceBetween={true}
            fullWidth={true}
            formSize={12}
          />
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
            <Button
              fullWidth
              variant="contained"
              onClick={handleCreate}
            >
              Utwórz
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </CategoriesContent>
  );
};

export default CreateEbook;