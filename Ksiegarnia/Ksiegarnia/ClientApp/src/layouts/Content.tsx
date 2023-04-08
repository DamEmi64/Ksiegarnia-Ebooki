﻿import { Link } from "react-router-dom";

const Content = (props: {children: React.ReactNode}) => {
    return (
        <main style={{marginTop: 20, height: "100%", display: "flex"}}>
            {props.children}
        </main>
    )
}

export default Content;