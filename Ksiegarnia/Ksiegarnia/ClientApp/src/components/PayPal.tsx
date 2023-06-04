import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const PayPal = (props: {transactionURL: string, handleCreateOrder?: (data: any, ) => void}) => {
  return (
    <iframe src={props.transactionURL}>

    </iframe>
  );
};

export default PayPal;
