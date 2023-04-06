import { Button, Grid, Typography } from "@mui/material";
import Ebook from "../models/api/ebook";
import Image from "./Image";
import Rate from "./Rate";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const BasicEbookView = (props: { ebook: Ebook }) => {
  const ebook: Ebook = props.ebook;

  const navigate = useNavigate();

  return (
    <Grid item container direction="column" alignItems="stretch" rowGap={2}>
      <Grid item className="pointer" onClick={() => navigate(`/Ebook/${ebook.id}`)} container justifyContent="center">
        <Image className={"maximixed-img"} alt={ebook.title} src={ebook.picture} />
      </Grid>
      <Typography variant="h6" textAlign="center">{ebook.title}</Typography>
      <Typography variant="h6" textAlign="center">
        {ebook.author.firstName + " " + ebook.author.lastName}
      </Typography>
      <Grid item container justifyContent="center">
        <Rate value={5}/>
      </Grid>
      <Button variant="contained" color="secondary">
        <ShoppingCartOutlined fontSize="large" style={{ color: "white" }} />
        36,46 zł
      </Button>
    </Grid>
  );
};

export default BasicEbookView;
