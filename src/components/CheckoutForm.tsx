import React, { useState } from "react";
import { ImSpinner8 } from "react-icons/im";
import { StripeElements } from "@stripe/stripe-js";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { useMutation } from "@apollo/client";
import { UPDATE_RESERVATION_PAYMENT_STATUS } from "@/graphql/queries";

function CheckoutForm({ totalPrice, reservationId }: { totalPrice: string; reservationId: string }) {
   const stripe = useStripe();
   const elements = useElements();
   const [loading, setLoading] = useState<boolean>(false);
   const [updatePaymentStatus] = useMutation(UPDATE_RESERVATION_PAYMENT_STATUS, {
      variables: { id: reservationId },
      onError: (error) => console.log(error),
   });

   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      if (!stripe || !elements) {
         return;
      }

      setLoading(true);

      const { error } = await stripe.confirmPayment({
         elements: elements as StripeElements,
         redirect: "if_required",
      });

      if (error) {
         toast({
            title: "Hata",
            description: error.message,
            variant: "destructive",
         });
      } else {
         updatePaymentStatus({ variables: { reservationId } });
      }
      setLoading(false);
   };

   return (
      <form onSubmit={handleSubmit}>
         <div className="w-11/12 max-w-[500px] mx-auto mt-10">
            <div className="flex items-center justify-center">
               <h1>Toplam tutar: {totalPrice}</h1>
            </div>
            <PaymentElement className="mt-10" />
            <div className="flex items-center justify-center">
               <Button className="mt-5 text-center" type="submit" variant={"outline"} disabled={!stripe || loading}>
                  {loading ? <ImSpinner8 className="w-6 h-6 animate-spin" /> : "Ödeme Yap"}
               </Button>
            </div>
         </div>
      </form>
   );
}

export default CheckoutForm;
