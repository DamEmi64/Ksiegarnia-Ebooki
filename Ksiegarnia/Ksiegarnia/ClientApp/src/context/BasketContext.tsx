import React, { useEffect, useState } from "react";
import Ebook from "../models/api/ebook";

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
  removeEbook: (ebookId: string, price: number) => void;
  containsEbook: (ebookId: string) => void;
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

  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(basket));
  }, [basket]);

  const addEbook = (newEbook: Ebook) => {
    if (
      basket.ebooks.filter((ebook: Ebook) => (
        ebook.id === newEbook.id
      )).length == 1
    ) {
      return;
    }

    setBasket({
      ebooks: [...basket.ebooks, newEbook],
      totalPrice: +(basket.totalPrice + newEbook.prize).toFixed(2),
    });
  };

  const removeEbook = (toRemoveEbookId: string, price: number) => {
    setBasket({
      ebooks: basket.ebooks.filter(
        (ebook: Ebook) => ebook.id !== toRemoveEbookId
      ),
      totalPrice: +(basket.totalPrice - price).toFixed(2),
    });
  };

  const containsEbook = (ebookId: string): boolean => {
    return basket.ebooks.filter((ebook: Ebook) => ebook.id === ebookId).length == 1 
  };

  const clear = () => {
    setBasket(initialBasket);
  };

  return (
    <BasketContext.Provider
      value={{ basket, addEbook, removeEbook, containsEbook, clear }}
    >
      {props.children}
    </BasketContext.Provider>
  );
};

export default BasketProvider;
