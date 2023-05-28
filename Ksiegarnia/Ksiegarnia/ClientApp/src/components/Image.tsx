import React from "react"

const srcBeginning = 'data'
const srcBeginningPng = 'data:image/png;base64,'

const Image = (props: {
  src: string;
  height?: number;
  width?: number;
  alt?: string;
  className?: string;
  style?: any;
}) => {
  return (
    <img
      className={props.className}
      alt={props.alt}
      height={props.height}
      width={props.width}
      src={`${!props.src.startsWith(srcBeginning) ? srcBeginningPng : ""}${props.src}`}
      style={props.style}
    />
  );
};

export default Image;
