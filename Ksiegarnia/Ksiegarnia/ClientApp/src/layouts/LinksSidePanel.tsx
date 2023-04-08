import { Grid, Link, Typography } from "@mui/material";
import { LinkProps } from "../models/linkProps";

const LinksSidePanel = (props: {title: string, links: LinkProps[]}) => {
    return (
        <Grid container direction="column" rowGap={2}>
            <Typography variant="h5">
                {props.title}
            </Typography>
            <Grid item container direction="column" className="links-panel">
                {props.links.map((link: LinkProps, index: number) => (
                    <Link key={index} href={link.url}>
                        {link.title}
                    </Link>
                ))}
            </Grid>
        </Grid>
    )
}

export default LinksSidePanel;