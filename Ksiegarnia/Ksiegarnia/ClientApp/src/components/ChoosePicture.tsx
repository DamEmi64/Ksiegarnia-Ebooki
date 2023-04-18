import { AddAPhoto } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useState } from "react";

const ChoosePicture = (props: {
  file?: string;
  handleSelectFile: (file: string) => void;
}) => {
  const [picture, setPicture] = useState<string>(props.file ? props.file : "");

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files && event.target.files[0]){
        const reader = new FileReader()
        reader.onloadend = function() {
            const gotFile: string = reader.result as string
            setPicture(gotFile)
            props.handleSelectFile(gotFile)
        }
        reader.readAsDataURL(event.target.files[0])
    }
  };

  return (
    <IconButton className={picture && "show-on-hover"} component="label" style={{position: "absolute", zIndex: 1}}>
      <AddAPhoto htmlColor="black" style={{ fontSize: 60 }} />
      <input
        type="file"
        hidden
        accept="image/png, image/jpeg"
        onChange={handleSelectFile}
      />
    </IconButton>
  );
};

export default ChoosePicture;
