"use client"
import { CardElement } from "@stripe/react-stripe-js"

export const JoinGroupPaymentForm = () => {
  return (
    <div className="flex flex-col gap-y-3">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#B4B0AE",
              "::placeholder": {
                color: "#B4B0AE",
              },
            },
          },
        }}
        className="bg-themeBlack border-[1px] border-themeGray outline-none rounded-lg p-3"
      />
      {/* <Button onClick={onPayToJoin}>
        <Loader loading={isPending}>Pay Now</Loader>
      </Button> */}
    </div>
  )
}
