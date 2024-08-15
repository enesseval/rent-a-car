"use client";

import { GET_AVAILABLE_VEHICLE_COUNT, GET_NOT_AVAILABLE_VEHICLE_COUNT, RESERVATIONS_TOTAL_PRICES_SUBSCRIPTION } from "@/graphql/queries";
import { useSubscription } from "@apollo/client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Label, Pie, PieChart, XAxis } from "recharts";
import Loading from "./Loading";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface Reservation {
   total_price: string;
   created_at: string;
}

const chartConfig = {
   available: {
      label: "Müsait",
      color: "hsl(var(--chart-1))",
   },
   notAvailable: {
      label: "Müsait değil",
      color: "hsl(var(--chart-2))",
   },
} satisfies ChartConfig;

const barChartConfig = {
   views: {
      label: "Toplam",
   },
   total: {
      label: "Toplam Ödemeler",
      color: "hsl(var(--chart-3))",
   },
} satisfies ChartConfig;

function Dashboard() {
   const [activeChart, setActiveChart] = React.useState<keyof typeof barChartConfig>("total");
   const { data: avaliableVehicles, loading: avaliableVehiclesLoading } = useSubscription(GET_AVAILABLE_VEHICLE_COUNT);
   const { data: dontAvailableVehicles, loading: dontAvailableVehiclesLoading } = useSubscription(GET_NOT_AVAILABLE_VEHICLE_COUNT);
   const { data: reservationsTotalPrices, loading: reservationsTotalPricesLoading } = useSubscription(RESERVATIONS_TOTAL_PRICES_SUBSCRIPTION);

   const pieChartData: { name: string; value: number; fill: string }[] = [];
   const barChartData: { total_price: number; date: string }[] = [];

   if (avaliableVehicles && dontAvailableVehicles) {
      pieChartData.push(
         { name: chartConfig.available.label, value: avaliableVehicles.vehicles_aggregate.aggregate.count, fill: chartConfig.available.color },
         { name: chartConfig.notAvailable.label, value: dontAvailableVehicles.vehicles_aggregate.aggregate.count, fill: chartConfig.notAvailable.color }
      );
   }

   let total = 0;
   if (reservationsTotalPrices) {
      reservationsTotalPrices.reservations.map((reservation: Reservation) => {
         total += parseFloat(reservation.total_price.replace(/[^0-9.-]+/g, ""));
         barChartData.push({ total_price: parseFloat(reservation.total_price.replace(/[^0-9.-]+/g, "")), date: reservation.created_at });
      });
   }

   console.log(avaliableVehicles);

   if (avaliableVehiclesLoading || dontAvailableVehiclesLoading || reservationsTotalPricesLoading) return <Loading />;

   return (
      <div>
         <Card className="flex flex-col max-w-[300px] mx-auto">
            <CardHeader className="items-center pb-0">
               <CardTitle>Toplam araç sayısı</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
               <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                  <PieChart>
                     <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                     <Pie data={pieChartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} strokeWidth={5}>
                        <Label
                           content={({ viewBox }) => {
                              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                 return (
                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="central">
                                       <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                          {avaliableVehicles.vehicles_aggregate.aggregate.count + dontAvailableVehicles.vehicles_aggregate.aggregate.count}
                                       </tspan>
                                       <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                          Toplam Araç
                                       </tspan>
                                    </text>
                                 );
                              }
                           }}
                        />
                     </Pie>
                  </PieChart>
               </ChartContainer>
            </CardContent>
         </Card>
         <Card className="mt-10 max-w-[1000px] mx-auto">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
               <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                  <CardTitle>Alınan Ödemeler</CardTitle>
               </div>
               <div className="flex">
                  {["total"].map((key) => {
                     const chart = key as keyof typeof barChartConfig;
                     return (
                        <button
                           key={chart}
                           data-active={activeChart === chart}
                           className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                           onClick={() => setActiveChart(chart)}
                        >
                           <span className="text-xs text-muted-foreground">{barChartConfig[chart].label}</span>
                           <span className="text-lg font-bold leading-none sm:text-3xl">${total.toFixed(2)}</span>
                        </button>
                     );
                  })}
               </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
               <ChartContainer config={barChartConfig} className="aspect-auto h-[250px] w-full">
                  <BarChart
                     accessibilityLayer
                     data={barChartData}
                     margin={{
                        left: 12,
                        right: 12,
                     }}
                  >
                     <CartesianGrid vertical={false} />
                     <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                           return format(new Date(value), "d MMMM", { locale: tr });
                        }}
                     />
                     <ChartTooltip
                        content={<ChartTooltipContent className="w-[150px]" nameKey="Miktar" />}
                        labelFormatter={(value) => {
                           return format(new Date(value), "d MMMM u", { locale: tr });
                        }}
                     />
                     <Bar dataKey={"total_price"} name={"Miktar    $"} fill={`var(--color-${activeChart})`} />
                  </BarChart>
               </ChartContainer>
            </CardContent>
         </Card>
      </div>
   );
}

export default Dashboard;
