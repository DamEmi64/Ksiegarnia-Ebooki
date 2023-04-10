import { Alert, Dialog, DialogTitle, Snackbar, Typography } from "@mui/material"
import React, { useEffect } from "react";

const Notification = (props: {
    open?: boolean,
    isSuccess?: boolean,
    message: string
}) => {

    const [open, setOpen] = React.useState<boolean>(false);

    useEffect(() => {
        if(props.open != undefined){
            setOpen(props.open)
        }
    }, [props.open])

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={props.isSuccess ? "success" : "error"}>
                {props.message}
            </Alert>
        </Snackbar>
    )
}

export default Notification;