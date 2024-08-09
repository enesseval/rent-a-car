"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format, set } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { tr } from "date-fns/locale";

interface DateRangePickerProps {
   className?: string;
   onChange: (date: DateRange | undefined) => void;
   onError: (hasError: boolean) => void;
}

export function DateRangePicker({ className, onChange, onError }: DateRangePickerProps) {
   const [sameDayError, setSameDayError] = React.useState(false);
   const [date, setDate] = React.useState<DateRange | undefined>({
      from: new Date(),
      to: addDays(new Date(), 20),
   });

   const handleDateChange = (newDate: DateRange | undefined) => {
      setDate(newDate);
      onChange(newDate);
   };

   React.useEffect(() => {
      if (date?.from !== undefined) {
         if (date?.from?.getTime() === date?.to?.getTime()) {
            setSameDayError(true);
            onError(true);
         } else {
            setSameDayError(false);
            onError(false);
         }
      }
   }, [date, onError]);

   return (
      <div className={cn("grid gap-2 relative", className)}>
         <Popover>
            <PopoverTrigger asChild>
               <Button id="date" variant={"outline"} className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                     date.to ? (
                        <>
                           {format(date.from, "LLL dd, y", { locale: tr })} - {format(date.to, "LLL dd, y", { locale: tr })}
                        </>
                     ) : (
                        format(date.from, "LLL dd, y", { locale: tr })
                     )
                  ) : (
                     <span>Pick a date</span>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                  locale={tr}
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                  disabled={{
                     before: new Date(),
                  }}
               />
            </PopoverContent>
         </Popover>
         {
            <div className={cn("absolute top-10 invisible", sameDayError && "visible")}>
               <p className="text-red-800">Tarihler aynı olamaz</p>
            </div>
         }
      </div>
   );
}
