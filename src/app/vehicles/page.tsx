"use client";

import React, { useState } from "react";
import { useSubscription } from "@apollo/client";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { Vehicle } from "@/types/graphqlTypes";
import { Button } from "@/components/ui/button";
import VehicleCard from "@/components/VehicleCard";
import { VEHICLE_SUBSCRIPTION } from "@/graphql/queries";
import VehiclesLeftSideBar from "@/components/VehiclesLeftSideBar";

interface Filters {
   brand_id: string | "";
   model_id: string | "";
   fuel: string | "";
   gear: string | "";
   daily_price: string | "";
}

function Cars() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const to = searchParams.get("to") || "";
   const from = searchParams.get("from") || "";

   const [filters, setFilters] = useState<Filters>();

   const createQuery = (filters: Filters | undefined, from: string, to: string) => {
      const filterConditions: {
         where: {
            avaliable: { _eq: true };
            _not: { reservations: { _and: { end_date: { _gte?: string }; start_date: { _lte?: string } } } };
            _or: { brand_id?: { _eq?: string }; model_id?: { _eq?: string }; fuel?: { _eq?: string }; gear?: { _eq?: string }; daily_price?: string };
         };
      } = {
         where: { avaliable: { _eq: true }, _not: { reservations: { _and: { end_date: { _gte: from }, start_date: { _lte: to } } } }, _or: {} },
      };

      if (filters?.brand_id) filterConditions.where._or.brand_id = { _eq: filters.brand_id };
      if (filters?.model_id) filterConditions.where._or.model_id = { _eq: filters.model_id };
      if (filters?.fuel) filterConditions.where._or.fuel = { _eq: filters.fuel };
      if (filters?.gear) filterConditions.where._or.gear = { _eq: filters.gear };
      if (filters?.daily_price) filterConditions.where._or.daily_price = filters.daily_price;

      return filterConditions;
   };

   const { data, loading, error } = useSubscription(VEHICLE_SUBSCRIPTION, { variables: { where: createQuery(filters, from, to).where } });

   const handleFilter = (newFilters: Filters) => {
      setFilters(newFilters);
   };

   if (from === "" || to === "") {
      return (
         <div className="w-full h-[600px] flex flex-col items-center justify-center space-y-5">
            <h1>Araçları görebilmek için lütfen tarih seçiniz.</h1>
            <p>Anasayfaya gitmek için tıklayınız.</p>
            <Button variant={"outline"} onClick={() => router.push("/")}>
               Anasayfaya git
            </Button>
         </div>
      );
   }

   return (
      <div>
         <Navbar />
         <div className="flex w-full justify-center">
            <VehiclesLeftSideBar onFilter={handleFilter} />

            <div
               className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 w-full", loading && "flex flex-col", !error && data && data.vehicles.length === 0 ? "flex justify-center" : "")}
            >
               {loading && (
                  <div className="w-full max-h-[600px] flex justify-center items-center">
                     <Loading />
                  </div>
               )}
               {!error && data && data.vehicles.length === 0 ? (
                  <div className="h-[500px] flex items-center">
                     <p>Aradığınız kriterlere uygun araç bulunamadı</p>
                  </div>
               ) : (
                  data && data.vehicles.map((vehicle: Vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)
               )}
               {Array(3)
                  .fill(null)
                  .map((_, index) => (
                     <div key={index} className="h-[300px]"></div>
                  ))}
            </div>
         </div>
      </div>
   );
}

export default Cars;
