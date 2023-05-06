import { ShoppingCartOutlined } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BasketContext } from "../../context/BasketContext";

const Cart = () => {
  const basketContext = React.useContext(BasketContext)?.basket;

  const navigate = useNavigate();

  return (
    <IconButton onClick={() => navigate("/transaction")}>
      <ShoppingCartOutlined fontSize="large" style={{ color: "white" }} />
      <Stack marginLeft={2}>
        <Typography variant="h6" color="white" textAlign="start">
          {basketContext?.ebooks.length} szt
        </Typography>
        <Typography variant="h6" color="white">
          {basketContext?.totalPrice} zł
        </Typography>
      </Stack>
    </IconButton>
  );
};

export default Cart;
