import { useSearchParams } from "react-router-dom";
import React from "react"
import { TransactionMessage } from "../../models/transactionMessages";
import EbookTransactionMessage from "./EbookTransactionMessage";
import PremiumTransactionMessage from "./PremiumTransactionMessage";
import DistinctTransactionMessage from "./DistinctTransactionMessage";

const TransactionMessageView = () => {

    const [searchParams] = useSearchParams();

    const messageType = searchParams.get("type") as TransactionMessage;
    const succeeded = searchParams.get("success") === "true";

    if (messageType === TransactionMessage.BOOK) {
      return <EbookTransactionMessage succeeded={succeeded} />;
    }

    if (messageType === TransactionMessage.PREMIUM) {
      return <PremiumTransactionMessage succeeded={succeeded} />;
    }

    return <DistinctTransactionMessage succeeded={succeeded} />;

}

export default TransactionMessageView;