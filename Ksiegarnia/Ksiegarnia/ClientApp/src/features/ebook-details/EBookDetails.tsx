import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../pages/Loading";
import { useContext, useEffect, useState } from "react";
import EbookService from "../../services/EbookService";
import Ebook from "../../models/api/ebook";
import { NotificationContext } from "../../context/NotificationContext";
import { Button, Grid, Typography } from "@mui/material";
import CategoriesContent from "../../layouts/CategoriesContent";
import Image from "../../components/Image";
import React from "react";
import Rate from "../../components/EbookRate";
import { PictureAsPdf } from "@mui/icons-material";
import EbooksSlider from "../../components/EbooksSlider";
import { BasketContext } from "../../context/BasketContext";
import { UserContext } from "../../context/UserContext";
import EbookGrades from "./EbookGrades";
import EbooksReviews from "./EbooksReviews";
import { EbookSortOptions } from "../../models/ebookSortOptions";
import EbookPrice from "../../components/EbookPrice";
import EbookImage from "../../components/EbookImage";
import ReportEbook from "./ReportEbook";

const Data = (props: { label: string; value: string | React.ReactNode }) => {
  return (
    <Grid item container justifyContent="space-between">
      <Grid item>
        <Typography variant="h6" display="inline" textAlign="end">
          {props.label}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6" display="inline" textAlign="end">
          {props.value}
        </Typography>
      </Grid>
    </Grid>
  );
};

const BigData = (props: { label: string; value: string | React.ReactNode }) => {
  return (
    <Grid item container direction="column">
      <Typography variant="h5" marginBottom={2} fontWeight="bold">
        {props.label}
      </Typography>
      <Typography variant="h6">{props.value}</Typography>
    </Grid>
  );
};

const EbookDetails = () => {
  const ebookId = useParams().id as string;
  const [ebook, setEbook] = useState<Ebook>();

  const basketContext = React.useContext(BasketContext);
  const notificationContext = useContext(NotificationContext);

  const FAILED_MESSAGE = "Nie znaleziono takiego ebooka";

  const navigate = useNavigate();

  useEffect(() => {
    EbookService.getById(ebookId)
      .then((response) => {
        setEbook(response.data);
      })
      .catch(() => {
        notificationContext?.setNotification({
          isVisible: true,
          isSuccessful: false,
          message: FAILED_MESSAGE,
        });
        navigate("../");
      });
  }, [ebookId]);

  if (!ebookId || !ebook) {
    return <Loading />;
  }

  return (
    <CategoriesContent>
      <Grid item container direction="column" rowGap={4} marginTop={2}>
        <Grid item container columnGap={4} rowGap={4}>
          <Grid
            item
            xs={12}
            md={4}
            container
            height="320px"
            width="220px"
            justifyContent="center"
            alignItems="center"
          >
            <EbookImage
              alt={ebook.title}
              src={ebook.picture}
              style={{ maxWidth: "100%", width: "auto", height: "100%" }}
              ebookDistinction={ebook.distinction}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={7}
            lg={4.8}
            container
            direction="column"
            rowGap={2}
          >
            <Grid item container alignItems="start" justifyContent="space-between" columnGap={4}>
              <Typography variant="h4" marginBottom={2}>
                {ebook.title}
              </Typography>
              <ReportEbook/>
            </Grid>
            <Data
              label="Autor"
              value={ebook.author.firstName + " " + ebook.author.lastName}
            />
            <Data label="Kategoria" value={ebook.genre.name} />
            <Data label="Ocena" value={<Rate value={4.5} />} />
            <Data label="Stron" value={ebook.pageNumber} />
            <Data label="Format" value={<PictureAsPdf fontSize="large" />} />
          </Grid>
          <Grid
            item
            xs={12}
            md={8}
            lg={2.2}
            container
            direction={{ md: "column" }}
            justifyContent={{ xs: "space-between", md: "end" }}
            rowGap={2}
            marginBottom={2}
          >
            <Grid item xs={12} container alignItems="end" justifyContent={{xs: "start", lg: "end"}}>
              <Typography variant="h4">
                <EbookPrice price={ebook.prize} promotion={ebook.promotion} />
              </Typography>
            </Grid>
            {basketContext?.doShouldShowAddToBasket(ebook) && (
              <Button
                variant="contained"
                onClick={() => basketContext?.addEbook(ebook)}
              >
                Dodaj do koszyka
              </Button>
            )}
          </Grid>
        </Grid>
        <BigData label="Opis" value={ebook.description} />
        <BigData label="Oceny" value={<EbookGrades />} />
        <EbooksReviews ebook={ebook} />
        <EbooksSlider title="Polecane" sort={EbookSortOptions.BestSeller} />
      </Grid>
    </CategoriesContent>
  );
};

export default EbookDetails;
