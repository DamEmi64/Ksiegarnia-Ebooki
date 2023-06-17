import { Button, Grid, Typography } from "@mui/material";
import Ebook from "../../../../models/api/ebook";
import React, { useContext, useEffect, useState } from "react";
import Rate from "../../../../components/EbookRate";
import { useNavigate } from "react-router-dom";
import Image from "../../../../components/Image";
import ConfirmationDialog from "../../../../components/ConfirmationDialog";
import EbookService from "../../../../services/EbookService";
import { NotificationContext } from "../../../../context/NotificationContext";
import DistinctEbook from "./manage-ebook/DistinctEbook";
import PromoteEbook from "./manage-ebook/PromoteEbook";
import EbookPrice from "../../../../components/EbookPrice";
import EbookImage from "../../../../components/EbookImage";
import DeleteEbook from "./DeleteEbook";
import { UserContext } from "../../../../context/UserContext";
import { EbookAcceptance } from "../../../../models/api/ebookAcceptance";
import EbookStatus from "../../../../components/EbookStatus";

const AuthorsEbook = (props: { ebook: Ebook; update: () => void }) => {
  const [ebook, setEbook] = useState<Ebook>(props.ebook);

  const navigate = useNavigate();

  useEffect(() => {
    setEbook(props.ebook);
  }, [props.ebook]);

  return (
    <Grid
      key={ebook.id}
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      xl={2.4}
      container
      justifyContent="center"
    >
      <Grid item xs={10} className="ebook ebook-rounded">
        <Grid item container direction="column" alignItems="stretch" rowGap={2}>
          <Grid
            item
            height="220px"
            className="pointer"
            container
            justifyContent="center"
            alignItems="center"
            onClick={() => navigate(`/Ebook/${ebook.id}`)}
          >
            <EbookImage
              alt={ebook.title}
              src={ebook.picture}
              style={{ maxWidth: "100%", width: "auto", height: "100%" }}
              ebookDistinction={ebook.distinction}
            />
          </Grid>
          <Grid item>
            <Typography variant="h6" textAlign="center">
              {ebook.title}
            </Typography>
            {ebook.verificationStatus !== EbookAcceptance.Accepted && (
              <EbookStatus verificationStatus={ebook.verificationStatus} />
            )}
          </Grid>
          <Grid item container justifyContent="center" columnGap={1}>
            <Typography variant="h6">Cena:</Typography>
            <Typography variant="h6" fontWeight="bold">
              <EbookPrice
                authorId={ebook.author.id}
                price={ebook.prize}
                promotion={ebook.promotion}
              />
            </Typography>
          </Grid>
          <Grid item container justifyContent="center">
            <Rate value={ebook.grade} />
          </Grid>
          <Grid item xs={6} container justifyContent="center" marginTop={1}>
            <Button
              fullWidth
              variant="contained"
              style={{ borderRadius: 10 }}
              onClick={() => navigate(`/ebook/${ebook.id}/edit`)}
            >
              Edytuj
            </Button>
          </Grid>
          <Grid item xs={6} container justifyContent="center">
            <PromoteEbook
              ebookId={ebook.id}
              ebookPrize={ebook.prize}
              ebookPromotion={ebook.promotion}
              update={props.update}
            />
          </Grid>
          {!(ebook.distinction && ebook.distinction.howLong != 0) && (
            <Grid item xs={6} container justifyContent="center">
              <DistinctEbook
                ebookId={ebook.id}
                ebookDistinction={ebook.distinction}
                update={props.update}
              />
            </Grid>
          )}
          <Grid item xs={6} container justifyContent="center">
            <DeleteEbook ebookId={ebook.id} handleAccept={props.update} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AuthorsEbook;
