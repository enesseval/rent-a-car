"use client";
import Navbar from "@/components/Navbar";
import { DateRangePicker } from "@/components/DateRangePicker";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { useSubscription } from "@apollo/client";
import { RESERVATIONS_COUNT } from "@/graphql/queries";
import { useRouter } from "next/navigation";

export default function Home() {
   const router = useRouter();
   const [hasError, setHasError] = useState(false);
   const [date, setDate] = useState<DateRange | undefined>(undefined);

   const { data: reservationCountData, loading: reservationCountLoading, error: reservationCountError } = useSubscription(RESERVATIONS_COUNT);

   const handleDateChange = (date: DateRange | undefined) => {
      setDate(date);
   };

   const handleDateError = (error: boolean) => setHasError(error);

   const handleSubmit = () => {
      if (!reservationCountError && !reservationCountLoading) {
         if (reservationCountData.reservations_aggregate.aggregate.count === 0) {
            router.push("/vehicles");
         } else {
            const from = date?.from ? date.from.toISOString().split("T")[0] : "";
            const to = date?.to ? date.to.toISOString().split("T")[0] : "";
            router.push(`/vehicles?from=${from}&to=${to}`);
         }
      }
   };

   return (
      <div className="h-screen overflow-hidden bg-[url('/bg.jpg')] bg-no-repeat bg-cover">
         <Navbar />
         <div className="flex items-center justify-center mt-[200px] gap-2">
            <DateRangePicker onChange={handleDateChange} onError={handleDateError} />
            <Button onClick={() => handleSubmit()} disabled={hasError || !date || reservationCountLoading} variant={"outline"}>
               Araç Bul
            </Button>
         </div>
      </div>
   );
}
