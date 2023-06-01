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
  const ebookDistinctionLogic = () => {
    if (props.ebookDistinction && props.ebookDistinction.howLong != 0) {
      return "distincted-ebook";
    }

    return "";
  };

  return (
    <Image
      className={`${props.className} ${ebookDistinctionLogic()}`}
      alt={props.alt}
      height={props.height}
      width={props.width}
      src={props.src}
      style={props.style}
    />
  );
};

export default EbookImage;
