import { Grid, Paper, Typography } from "@mui/material";
import { LinkProps } from "../models/linkProps";
import { Link } from "react-router-dom";

const LinksSidePanel = (props: {title: string, links: LinkProps[]}) => {
    return (
        <Grid item xs={2} container justifyContent="center">
            <Paper style={{padding: "20px 40px 20px 20px", position: "fixed"}}>
                <Grid container direction="column" rowGap={2}>
                    <Typography variant="h5">
                        {props.title}
                    </Typography>
                    <Grid item container direction="column" className="links-panel">
                        {props.links.map((link: LinkProps, index: number) => (
                            <Link key={index} to={link.url}>
                                <Typography>
                                    {link.title}
                                </Typography>
                            </Link>
                        ))}
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}

export default LinksSidePanel;