import React, { useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { regulations } from "../assets/regulations";
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import useWindowResize from "./useWindowResize";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Regulations = (props: { scaleMultiplier?: number }) => {
  const [numberOfPages, setNumberOfPages] = React.useState<number>(0);

  const regulationsURL = `data:application/pdf;base64,${regulations}`;

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
      return 1;
    }

    return 0.8;
  };

  const [pageScale, setPageScale] = React.useState<number>(getPageScale());

  const [width] = useWindowResize();

  useEffect(() => {
    const newPageScale = getPageScale();
    if (pageScale !== newPageScale) {
      setPageScale(newPageScale);
    }
  }, [width]);

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
    <Grid item container width="100%" justifyContent="center">
      <Document
        file={{ url: regulationsURL }}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {getPages().map((page: number) => (
          <Page
            key={page}
            scale={
              pageScale * (props.scaleMultiplier ? props.scaleMultiplier : 1)
            }
            pageNumber={page}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        ))}
      </Document>
    </Grid>
  );
};

export default Regulations;
