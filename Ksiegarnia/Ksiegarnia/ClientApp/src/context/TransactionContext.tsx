import React, { useEffect, useState } from "react";
import Ebook from "../models/api/ebook";
import { UserContext } from "./UserContext";
import { Distinction } from "../models/api/distinction";

export interface DistinctionDetails {
  ebookId: string;
  startDate: string;
  howLong: number;
}

export interface TransactionProps {
  distinctionDetails?: DistinctionDetails;
}

const initialTransaction: TransactionProps = {}

export interface TransactionContextType {
  transaction: TransactionProps;
  setDistinctionDetails: (distinctionDetails: DistinctionDetails) => void;
  clearDistinctionDetails: () => void;
}

export const TransactionContext: React.Context<
  TransactionContextType | undefined
> = React.createContext<TransactionContextType | undefined>(undefined);

const TransactionProvider = (props: { children: React.ReactNode }) => {
  const [transaction, setTransaction] = useState<TransactionProps>(() => {
    const savedTransactionStr = localStorage.getItem("transaction");

    if (savedTransactionStr) {
      const savedTransaction: TransactionProps =
        JSON.parse(savedTransactionStr);
      return savedTransaction;
    } else {
      return initialTransaction;
    }
  });

  useEffect(() => {
    localStorage.setItem("transaction", JSON.stringify(transaction));
  }, [transaction]);

  const setDistinctionDetails = (distinctionDetails: DistinctionDetails) => {
    setDistinctionDetails(distinctionDetails);
  };

  const clearDistinctionDetails = () => {
    setTransaction({})
  };

  return (
    <TransactionContext.Provider
      value={{ transaction, setDistinctionDetails, clearDistinctionDetails }}
    >
      {props.children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
