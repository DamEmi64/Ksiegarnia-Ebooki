import { Link } from "react-router-dom";

const Content = (props: {children: React.ReactNode}) => {
    return (
        <div>
            {props.children}
        </div>
    )
}

export default Content;