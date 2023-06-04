import { Typography } from "@mui/material";
import { Distinction } from "../models/api/distinction";
import Image from "./Image";
import React from "react";

const EbookImage = (props: {
  src: string;
  height?: number;
  width?: number;
  alt?: string;
  className?: string;
  style?: any;
  ebookDistinction?: Distinction;
}) => {
  const isDistincted = () => {
    return props.ebookDistinction && props.ebookDistinction.howLong != 0;
  };

  return (
    <React.Fragment>
      <Image
        className={`${props.className ? props.className : ""} ${
          isDistincted() ? "distincted-ebook" : ""
        }`}
        alt={props.alt}
        height={props.height}
        width={props.width}
        src={props.src}
        style={props.style}
      />
    </React.Fragment>
  );
};

export default EbookImage;
