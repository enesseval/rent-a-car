"use client";

import React, { useState } from "react";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import VehicleCard from "@/components/VehicleCard";
import VehiclesLeftSideBar from "@/components/VehiclesLeftSideBar";
import { VEHICLE_SUBSCRIPTION } from "@/graphql/queries";
import { cn } from "@/lib/utils";
import { Vehicle } from "@/types/graphqlTypes";
import { useSubscription } from "@apollo/client";
import { useSearchParams } from "next/navigation";

interface Filters {
   brand_id: string | "";
   model_id: string | "";
   fuel: string | "";
   gear: string | "";
   daily_price: string | "";
}

function Cars() {
   const searchParams = useSearchParams();
   const to = searchParams.get("to") || "";
   const from = searchParams.get("from") || "";
   const [filters, setFilters] = useState<Filters>();

   const createQuery = (filters: Filters | undefined, from: string, to: string) => {
      // I'm assuming the type of the filterConditions based on your code snippets. It's probably not complete.
      const filterConditions: {
         where: {
            avaliable: { _eq: true };
            _not: { reservations: { _and: { end_date: { _gte?: string }; start_date: { _lte?: string } } } };
            _or: { brand_id?: { _eq?: string }; model_id?: { _eq?: string }; fuel?: { _eq?: string }; gear?: { _eq?: string }; daily_price?: string };
         };
      } = {
         where: { avaliable: { _eq: true }, _not: { reservations: { _and: { end_date: { _gte: from }, start_date: { _lte: to } } } }, _or: {} },
      };

      // Setup filterConditions. Ofc, this could be done direclty in the line above, but I keep it separate so it might be easier to follow.
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

   return (
      <div>
         <Navbar />
         <div className="flex">
            <VehiclesLeftSideBar onFilter={handleFilter} />
            <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 w-full", loading ? "flex" : "", !error && data && data.vehicles.length === 0 ? "flex justify-center" : "")}>
               {loading && <Loading />}
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
