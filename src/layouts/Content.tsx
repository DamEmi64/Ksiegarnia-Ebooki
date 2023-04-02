import { Link } from "react-router-dom";

const Content = (props: {children: React.ReactNode}) => {
    return (
        <main style={{marginTop: 20}}>
            {props.children}
        </main>
    )
}

export default Content;