import React from "react";
import { Promotion } from "../models/api/promotion";
import { UserContext } from "../context/UserContext";

const EbookPrice = (props: { price: number; promotion?: Promotion }) => {
  const isUserPremium = React.useContext(UserContext)?.user.isPremium;

  const promotion = props.promotion;
  const price = props.price;

  const priceLogic = () => {
    if (promotion?.isPremiumOnly && isUserPremium) {
      return (
        <React.Fragment>
          <del>{price.toFixed(2)} zł</del> {" "}
          {promotion.premiumPrize.toFixed(2)}
        </React.Fragment>
      );
    }

    if(props.promotion && props.promotion.prize != 0){
      return (
        <React.Fragment>
          <del>{props.price.toFixed(2)} zł</del> {" "}
          {props.promotion.prize.toFixed(2)}
        </React.Fragment>
      )
    }

    return props.price.toFixed(2);
  };

  return (
    <React.Fragment>
      {priceLogic()}
      {" zł"}
    </React.Fragment>
  );
};

export default EbookPrice;
