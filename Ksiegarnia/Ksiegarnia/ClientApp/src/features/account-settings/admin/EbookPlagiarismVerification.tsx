import { Button, Grid, Typography } from "@mui/material";
import { EbookAcceptance } from "../../../models/api/ebookAcceptance";
import Ebook from "../../../models/api/ebook";
import PlagiarismService from "../../../services/PlagiarismService";
import EbookService from "../../../services/EbookService";
import React from "react";
import EbookStatus from "../../../components/EbookStatus";
import FileService from "../../../services/FileService";
import AdminService from "../../../services/AdminService";
import { NotificationContext } from "../../../context/NotificationContext";

const EbookPlagiarismVerification = (props: { ebook: Ebook }) => {
  const [ebookContent, setEbookContent] = React.useState<string>("");

  const [ebookStatus, setEbookStatus] = React.useState<EbookAcceptance>(EbookAcceptance.Verifing)

  const notificationContext = React.useContext(NotificationContext)
  
  const SUCCESSFULLY_SUBMITED = "Wysłano zawartość ebooka do weryfikacji"

  React.useEffect(() => {
    AdminService.getEbookContent(props.ebook.id).then((response) => {
      setEbookContent(response.data);
    });
  }, []);

  const handleSubmitPlagiarismCheck = () => {
    PlagiarismService.submit(props.ebook.id, ebookContent).then((response) => {
      console.log(response);
      notificationContext?.setNotification({
        isVisible: true,
        isSuccessful: true,
        message: SUCCESSFULLY_SUBMITED
      })
    });
  };

  const handleCheckPlagiarismCheck = () => {
    PlagiarismService.checkResults(props.ebook.id)
    .then((response) => {
      if(response.status == 200){
        setEbookStatus(EbookAcceptance.Accepted)
      }
    })
    .catch((error) => {
      setEbookStatus(EbookAcceptance.Rejected)
    })
  };

  return (
    <Grid item container marginTop={2}>
      <EbookStatus verificationStatus={ebookStatus} />
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
