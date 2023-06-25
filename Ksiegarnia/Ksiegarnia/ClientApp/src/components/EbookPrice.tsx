import React from "react";
import { Promotion } from "../models/api/promotion";
import { UserContext } from "../context/UserContext";

const EbookPrice = (props: { authorId: string; price: number; promotion?: Promotion }) => {
  const isUserPremium = React.useContext(UserContext)?.user.isPremium;

  const promotion = props.promotion;
  const price = props.price;

  const priceLogic = () => {
    if (promotion?.isPremiumOnly) {
      if(isUserPremium){
        return (
          <React.Fragment>
            <del>{price.toFixed(2)} zł</del> {" "}
            {(promotion.prize + promotion.prize * 0.1).toFixed(2)}
          </React.Fragment>
        );
      }
    }
    else{
      if(promotion && promotion.prize != 0){
        return (
          <React.Fragment>
            <del>{props.price.toFixed(2)} zł</del> {" "}
            {(promotion.prize + promotion.prize * 0.1).toFixed(2)}
          </React.Fragment>
        )
      }
    }

    return (props.price + props.price * 0.1).toFixed(2);
  };

  return (
    <React.Fragment>
      {priceLogic()}
      {" zł"}
    </React.Fragment>
  );
};

export default EbookPrice;
