import React from "react";

const Content = (props: { children: React.ReactNode }) => (
  <main style={{ marginTop: 20, flexGrow: 1, width: "100%", display: "flex" }}>
    {props.children}
  </main>
);

export default Content;
