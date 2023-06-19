import React, { useEffect } from "react";

const HorizontalAd = () => {
  useEffect(() => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      data-ad-client="ca-pub-7774799498286441"
      data-ad-slot="9991008576"
      data-ad-format="auto"
      data-full-width-responsive="true"
      style={{ display: "block", width: "100%" }}
    ></ins>
  );
};

export default HorizontalAd;
