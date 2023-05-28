import React from "react";
import { useState } from "react";

const HiddenEmail = (props: { email: string }) => {

    const [isHidden, setIsHidden] = useState<boolean>(true)

    return (
        <React.Fragment>
            {isHidden ? (
                <span className="pointer" onClick={() => setIsHidden(false)} style={{fontWeight: "bold"}}>
                    wyświetl email
                </span>
            )
                :
                <React.Fragment>
                    {props.email}
                </React.Fragment>
            }
        </React.Fragment>
    )
}

export default HiddenEmail;