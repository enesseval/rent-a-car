"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/DateRangePicker";

export default function Home() {
   const router = useRouter();
   const [hasError, setHasError] = useState(false);
   const [date, setDate] = useState<DateRange | undefined>(undefined);

   const handleDateChange = (date: DateRange | undefined) => setDate(date);

   const handleDateError = (error: boolean) => setHasError(error);

   const handleSubmit = () => {
      const from = date?.from ? date.from.toISOString().split("T")[0] : "";
      const to = date?.to ? date.to.toISOString().split("T")[0] : "";
      router.push(`/vehicles?from=${from}&to=${to}`);
   };

   return (
      <div className="h-screen overflow-hidden bg-[url('/bg.jpg')] bg-no-repeat bg-cover">
         <Navbar />
         <div className="flex items-center justify-center mt-[200px] gap-2">
            <DateRangePicker onChange={handleDateChange} onError={handleDateError} />
            <Button onClick={() => handleSubmit()} disabled={hasError || !date} variant={"outline"}>
               {date ? "Araç Bul" : "Lütfen bir tarih seçiniz"}
            </Button>
         </div>
      </div>
   );
}
