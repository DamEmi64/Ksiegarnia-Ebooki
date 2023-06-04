import React, { useEffect, useState } from "react";
import Ebook from "../models/api/ebook";
import { UserContext } from "./UserContext";

export interface BasketProps {
  ebooks: Ebook[];
  totalPrice: number;
}

const initialBasket: BasketProps = {
  ebooks: [],
  totalPrice: 0,
};

export interface BasketContextType {
  basket: BasketProps;
  addEbook: (ebook: Ebook) => void;
  removeEbook: (toRemoveEbook: Ebook) => void;
  doShouldShowAddToBasket: (ebook: Ebook) => boolean;
  clear: () => void;
}

export const BasketContext: React.Context<BasketContextType | undefined> =
  React.createContext<BasketContextType | undefined>(undefined);

const BasketProvider = (props: { children: React.ReactNode }) => {
  const [basket, setBasket] = useState<BasketProps>(() => {
    const savedBasketStr = localStorage.getItem("basket");

    if (savedBasketStr) {
      const savedBasket: BasketProps = JSON.parse(savedBasketStr);
      return savedBasket;
    } else {
      return initialBasket;
    }
  });

  const userContext = React.useContext(UserContext);
  const userId = userContext?.user.data?.id;
  const isUserPremium = userContext?.user.isPremium;

  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(basket));
  }, [basket]);

  const getEbookPrice = (ebook: Ebook) => {
    if (!ebook.promotion) {
      return ebook.prize;
    }

    if (ebook.promotion?.isPremiumOnly && isUserPremium) {
      return ebook.promotion.premiumPrize;
    }

    if (ebook.promotion.prize != 0) {
      return ebook.promotion.prize;
    }

    return ebook.prize;
  };

  const addEbook = (newEbook: Ebook) => {
    if (
      basket.ebooks.filter((ebook: Ebook) => ebook.id === newEbook.id).length ==
      1
    ) {
      return;
    }

    const newEbookPrice = getEbookPrice(newEbook);

    setBasket({
      ebooks: [...basket.ebooks, newEbook],
      totalPrice: +(basket.totalPrice + newEbookPrice).toFixed(2),
    });
  };

  const removeEbook = (toRemoveEbook: Ebook) => {
    const toRemoveEbookPrice = getEbookPrice(toRemoveEbook);

    setBasket({
      ebooks: basket.ebooks.filter(
        (ebook: Ebook) => ebook.id !== toRemoveEbook.id
      ),
      totalPrice: +(basket.totalPrice - toRemoveEbookPrice).toFixed(2),
    });
  };

  const containsEbook = (ebookId: string): boolean => {
    return (
      basket.ebooks.filter((ebook: Ebook) => ebook.id === ebookId).length == 1
    );
  };

  const clear = () => {
    setBasket(initialBasket);
  };

  const doShouldShowAddToBasket = (ebook: Ebook) => {
    return !(
      userId === ebook.author.id ||
      containsEbook(ebook.id) ||
      userContext?.containsEbookId(ebook.id)
    );
  };

  return (
    <BasketContext.Provider
      value={{ basket, addEbook, removeEbook, doShouldShowAddToBasket, clear }}
    >
      {props.children}
    </BasketContext.Provider>
  );
};

export default BasketProvider;
