import { useEffect } from "react";

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
      src={`data:image/jpeg;base64,${props.src}`}
      style={props.style}
    />
  );
};

export default Image;
