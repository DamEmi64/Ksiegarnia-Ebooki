import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import EbookService from "../../../services/EbookService";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, Grid, IconButton } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import Loading from "../../../pages/Loading";

const EbookContentViewer = () => {

  const ebookId = useParams().id as string;

  const [content, setContent] = useState<string>();

  useEffect(() => {
    EbookService.getContentById(ebookId)
    .then((response) => {
      setContent(response.data);
    });
  }, []);

  if(!content){
    return <Loading/>
  }

  return (
    <Dialog fullWidth={true} fullScreen={true} open={true}>
      <embed
        src={`data:application/pdf;base64,${content}#toolbar=0`}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </Dialog>
  );
};

export default EbookContentViewer;
