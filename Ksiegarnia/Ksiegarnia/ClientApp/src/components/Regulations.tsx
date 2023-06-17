import React, { useEffect } from "react";

const Regulations = () => {
  const [numPages, setNumPages] = React.useState<number>(0);

  const onDocumentLoadSuccess = () => {
    setNumPages(numPages);
  };
  return (
    <div>
      AAA
    </div>
  );
};

export default Regulations;
