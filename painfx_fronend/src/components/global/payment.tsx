import { useCreateStripePaymentIntentMutation } from "@/redux/services/Payment/PaymentApiSlice";
import React from "react";
import { Button } from "../ui/button";


const PaymentButton = () => {
  const [createPaymentIntent] = useCreateStripePaymentIntentMutation();

  const handlePayment = async () => {
    try {
      await createPaymentIntent({ amount: 5000, currency: "usd" });
    } catch (error) {
      console.error("Payment initiation failed:", error);
    }
  };

  return <Button className="w-full rounded-2xl flex gap-3" onClick={handlePayment}>Upgrade</Button>;
};

export default PaymentButton;
