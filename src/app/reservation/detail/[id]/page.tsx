"use client";

import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { useSubscription } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance, loadStripe } from "@stripe/stripe-js";

import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import NotFound from "@/components/NotFound";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CheckoutForm from "@/components/CheckoutForm";
import { GET_RESERVATION_SUBSCRIPTION } from "@/graphql/queries";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const stripeKey = loadStripe("pk_test_51PnhdxP3acpnUkztYb9EVNvNJtWdj5pLUSl6GiNZ7RyLs2og1YempBGMPPqAOCAH4SUJFPByjqXtWBnBQO8y5xAK00gAJHY5hV");

function ReservationDetail() {
   const { theme } = useTheme();
   const { id } = useParams();
   const [comment, setComment] = useState("");
   const [timeleft, setTimeleft] = useState<number | null>(null);
   const [clientSecret, setClientSecret] = useState<string | undefined>();
   const { data, loading, error } = useSubscription(GET_RESERVATION_SUBSCRIPTION, { variables: { id: id } });

   const appearance: Appearance = {
      theme: theme === "dark" ? "night" : "stripe", // Temayı değiştirebilirsiniz: 'stripe', 'flat', 'night', 'none'
   };

   useEffect(() => {
      if (!loading && data.reservations.length !== 0) {
         const reservation = data.reservations[0];
         if (reservation.payment_status === false) {
            const createdAt = new Date(reservation.created_at).getTime();
            const now = new Date().getTime();
            const timeDiff = now - createdAt;
            const twoHoursInMilllis = 2 * 60 * 60 * 1000;
            const remainingTime = twoHoursInMilllis - timeDiff;

            if (remainingTime > 0) setTimeleft(remainingTime);
            else setTimeleft(0);
         }

         fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ totalPrice: reservation.total_price }),
         })
            .then((res) => {
               return res.json();
            })
            .then((data) => setClientSecret(data.clientSecret))
            .catch((error) => console.error("PaymentIntent oluşturulurken bir hata oluştu:", error));
      }
   }, [data, loading]);

   useEffect(() => {
      if (timeleft && timeleft > 0) {
         const timer = setInterval(() => {
            setTimeleft((prev) => (prev ? prev - 1000 : 0));
         }, 60000);
         return () => clearInterval(timer);
      }
   }, [timeleft]);

   const formatTimes = (milliseconds: number) => {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      return `${minutes} dakika`;
   };

   if (data && data.reservations.length === 0) return <NotFound />;
   if (loading && !data) return <Loading />;

   return (
      <div>
         <Navbar />
         {timeleft !== null && timeleft > 0 && data && !data.reservations[0].payment_status && (
            <div className="w-11/12 max-w-[1100px] mx-auto my-2">
               <Alert className="border-yellow-700 bg-yellow-700 font-bold text-xl text-center">
                  <AlertTitle>DİKKAT!</AlertTitle>
                  <AlertDescription>{formatTimes(timeleft)} içinde ödeme yapmazsanız rezervasyonunuz silinecektir.</AlertDescription>
               </Alert>
            </div>
         )}
         <div className="w-11/12 max-w-[1100px] mx-auto grid">
            <div>
               <Accordion type="single" collapsible>
                  <AccordionItem value="details">
                     <AccordionTrigger>Rezervasyon detayları</AccordionTrigger>
                     <AccordionContent>
                        {!loading && !error && data && (
                           <div className="flex flex-col items-center space-y-3">
                              <h1 className="text-xl">Sayın {data.reservations[0].driver_name}</h1>
                              <p>bizi tercih ettiğiniz için teşekkürler</p>

                              <p className="text-center">
                                 Aracınızı {data.reservations[0].start_date} tarihinde <span className="font-bold">Eskişehir</span> ofisimizden teslim alabilirsiniz.
                              </p>
                              <p>Teslim tarihiniz: {data.reservations[0].end_date}.</p>
                              <h1>Ödeme durumu: {data.reservations[0].payment_status === false ? "Henüz ödeme yapılmadı" : "Ödeme işlemi tamamlandı"} </h1>
                           </div>
                        )}
                     </AccordionContent>
                  </AccordionItem>
               </Accordion>
            </div>
            {data && !data.reservations[0].payment_status && (
               <div>
                  {clientSecret && (
                     <Elements stripe={stripeKey} options={{ clientSecret, appearance }}>
                        <CheckoutForm totalPrice={data.reservations[0].total_price} reservationId={data.reservations[0].id} />
                     </Elements>
                  )}
               </div>
            )}
         </div>
         {data && data.reservations[0].payment_status && (
            <div className="flex justify-center mt-10">
               <p>Kiralama süreciniz sonrası bu sayfayı tekrar ziyaret ederek deneyiminizi bizimle paylaşabilirsiniz.</p>
            </div>
         )}
         {new Date(data.reservations[0].end_date).getTime() - new Date().getTime() < 0 && (
            <div className="flex flex-col justify-center max-w-[300px] mx-auto mt-10 space-y-5">
               <Textarea onChange={(e) => setComment(e.target.value)} value={comment} />
               <Button variant={"outline"}>Gönder</Button>
            </div>
         )}
      </div>
   );
}

export default ReservationDetail;
