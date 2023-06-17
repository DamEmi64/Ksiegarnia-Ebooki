import { Button, Grid, Typography } from "@mui/material";
import { EbookAcceptance } from "../../../models/api/ebookAcceptance";
import Ebook from "../../../models/api/ebook";
import PlagiarismService from "../../../services/PlagiarismService";
import EbookService from "../../../services/EbookService";
import React from "react";
import EbookStatus from "../../../components/EbookStatus";

const EbookPlagiarismVerification = (props: { ebook: Ebook }) => {
  const [ebookContent, setEbookContent] = React.useState<string>("");

  React.useEffect(() => {
    EbookService.getContentById(props.ebook.id).then((response) => {
      setEbookContent(response.data);
    });
  }, []);

  const handleSubmitPlagiarismCheck = () => {
    PlagiarismService.submit(props.ebook.id, ebookContent).then((response) => {
      console.log(response);
    });
  };

  const handleCheckPlagiarismCheck = () => {
    console.log("A")
  };

  return (
    <Grid item container marginTop={2}>
      <EbookStatus verificationStatus={props.ebook.verificationStatus} />
      <Grid item container marginTop={3} columnGap={2}>
        <Button variant="contained" onClick={handleSubmitPlagiarismCheck}>
          Wyślij do sprawdzenia
        </Button>
        <Button variant="contained" onClick={handleCheckPlagiarismCheck}>
          Sprawdź
        </Button>
      </Grid>
    </Grid>
  );
};

export default EbookPlagiarismVerification;
