import { ShoppingCartOutlined } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BasketContext } from "../../context/BasketContext";

const Cart = (props: {fontColor?: string}) => {
  const basketContext = React.useContext(BasketContext)?.basket;

  const navigate = useNavigate();

  return (
    <IconButton onClick={() => navigate("/transaction")}>
      <ShoppingCartOutlined fontSize="large" style={{ color: props.fontColor ? props.fontColor : "white" }} />
      <Stack marginLeft={2}>
        <Typography variant="h6" color={props.fontColor ? props.fontColor : "white"} textAlign="start">
          {basketContext?.ebooks.length} szt
        </Typography>
        <Typography variant="h6" color={props.fontColor ? props.fontColor : "white"}>
          {basketContext?.totalPrice.toFixed(2)} zł
        </Typography>
      </Stack>
    </IconButton>
  );
};

export default Cart;
