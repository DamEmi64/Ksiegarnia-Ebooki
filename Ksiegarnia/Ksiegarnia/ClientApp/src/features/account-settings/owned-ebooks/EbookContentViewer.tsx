import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import EbookService from "../../../services/EbookService";
import { useParams } from "react-router-dom";
import { Dialog, DialogContent, Grid, IconButton } from "@mui/material";
import { pdfjs } from "react-pdf";
import { CloseOutlined } from "@mui/icons-material";
import Loading from "../../../pages/Loading";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
