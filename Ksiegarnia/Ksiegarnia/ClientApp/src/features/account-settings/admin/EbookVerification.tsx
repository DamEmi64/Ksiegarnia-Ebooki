import { useNavigate, useParams } from "react-router-dom";
import AccountSettings from "../../../pages/AccountSettings";
import Ebook from "../../../models/api/ebook";
import React from "react";
import EbookService from "../../../services/EbookService";
import Loading from "../../../pages/Loading";
import { Button, Grid, IconButton, Typography } from "@mui/material";
import Image from "../../../components/Image";
import EbookImage from "../../../components/EbookImage";
import { PictureAsPdf } from "@mui/icons-material";
import EbookPrice from "../../../components/EbookPrice";
import AdminService from "../../../services/AdminService";
import { NotificationContext } from "../../../context/NotificationContext";
import EbookPlagiarismVerification from "./EbookPlagiarismVerification";

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

const EbookVerification = () => {
  const ebookId = useParams().ebookId;

  const [ebook, setEbook] = React.useState<Ebook>();

  const notificationContext = React.useContext(NotificationContext);

  const SUCCESSFUL_APPROVED_MESSAGE = "Zatwierdzono ebooka";
  const SUCCESSFUL_DECLINED_MESSAGE = "Odrzucono ebooka";

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!ebookId) {
      navigate("/not-found");
    }

    EbookService.getById(ebookId as string)
      .then((response) => {
        setEbook(response.data);
      })
      .catch(() => {
        navigate("/not-found");
      });
  }, []);

  const handleAccept = () => {
    AdminService.verify(ebookId as string).then((response) => {
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: true,
        message: SUCCESSFUL_APPROVED_MESSAGE,
      });
      goBack()
    });
  };

  const handleReject = () => {
    AdminService.block(ebookId as string).then((response) => {
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: true,
        message: SUCCESSFUL_DECLINED_MESSAGE,
      });
      goBack()
    });
  }

  const goBack = () => {
    navigate("../");
  };

  if (!ebook) {
    return <Loading />;
  }

  return (
    <AccountSettings title={`Weryfikacja ebooka ${ebook.title}`}>
      <Grid item container direction="column" rowGap={6} marginTop={2}>
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
            <Data
              label="Autor"
              value={ebook.author.firstName + " " + ebook.author.lastName}
            />
            <Data label="Kategoria" value={ebook.genre.name} />
            <Data label="Stron" value={ebook.pageNumber} />
            <Data
              label="Tekst"
              value={
                <IconButton onClick={() => navigate("content")}>
                  <PictureAsPdf fontSize="large" htmlColor="black" />
                </IconButton>
              }
            />
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
            <Grid
              item
              xs={6}
              container
              alignItems="end"
              justifyContent={{ xs: "start", lg: "end" }}
            >
              <Typography variant="h4">
                <EbookPrice
                  authorId={ebook.author.id}
                  price={ebook.prize}
                  promotion={ebook.promotion}
                />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <BigData label="Opis" value={ebook.description} />
        <BigData
          label="System antyplagiatowy"
          value={<EbookPlagiarismVerification ebook={ebook} />}
        />
        <Grid item container justifyContent="center" columnGap={4}>
          <Grid item xs={4} sm={3} md={2} lg={1.5}>
            <Button fullWidth variant="contained" onClick={handleAccept}>
              Zatwierdź
            </Button>
          </Grid>
          <Grid item xs={4} sm={3} md={2} lg={1.5}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleReject}
            >
              Odrzuć
            </Button>
          </Grid>
          <Grid item xs={4} sm={3} md={2} lg={1.5}>
            <Button
              fullWidth
              variant="contained"
              onClick={goBack}
            >
              Anuluj
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </AccountSettings>
  );
};

export default EbookVerification;
