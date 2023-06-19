import { useEffect, useState } from "react";
import EbookService from "../../../../services/EbookService";
import { useParams } from "react-router-dom";
import { Dialog, useMediaQuery, useTheme } from "@mui/material";
import Loading from "../../../../pages/Loading";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import useWindowResize from "../../../../components/useWindowResize";
import { UserContext } from "../../../../context/UserContext";
import { Role } from "../../../../models/api/role";
import AdminService from "../../../../services/AdminService";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const EbookContentViewer = () => {
  const isUserAdmin = React.useContext(UserContext)?.containsRole(Role.Admin)
  const ebookId = useParams().ebookId as string;

  const [content, setContentElement] = useState<string>();
  const [numberOfPages, setNumberOfPages] = React.useState<number>(0);

  const [width] = useWindowResize();

  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("xs"));
  const matchesSM = useMediaQuery(theme.breakpoints.up("sm"));
  const matchesMD = useMediaQuery(theme.breakpoints.up("md"));
  const matchesLG = useMediaQuery(theme.breakpoints.up("lg"));
  const matchesXL = useMediaQuery(theme.breakpoints.up("xl"));

  const getPageScale = () => {
    if (matchesLG) {
      return 1.5;
    }

    if (matchesSM) {
      return 0.9;
    }

    if (matchesMD) {
      return 1.2;
    }

    return 0.8;
  };

  const [pageScale, setPageScale] = React.useState<number>(getPageScale());

  useEffect(() => {
    if(!isUserAdmin){
      EbookService.getContentById(ebookId).then((response) => {
        setContentElement(response.data);
      });
    }
    else{
      AdminService.getEbookContent(ebookId).then((response) => {
        setContentElement(response.data)
      })
    }
  }, []);

  useEffect(() => {
    const newPageScale = getPageScale();
    if (pageScale !== newPageScale) {
      setPageScale(newPageScale);
    }
  }, [width]);

  if (!content) {
    return <Loading />;
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumberOfPages(numPages);
  };

  const getPages = () => {
    const pages = [];

    for (let page = 1; page <= numberOfPages; page++) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <Dialog
      className="pdf-container"
      fullWidth={true}
      fullScreen={true}
      open={true}
    >
      <Document
        file={`data:application/pdf;base64,${content}`}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {getPages().map((page: number) => (
          <div
            key={page}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Page
              scale={pageScale}
              pageNumber={page}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </div>
        ))}
      </Document>
    </Dialog>
  );
};

export default EbookContentViewer;

/*      <embed
        src={`data:application/pdf;base64,${content}#toolbar=0`}
        type="application/pdf"
        width="100%"
        height="100%"
      />*/
