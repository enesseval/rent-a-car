"use client";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import VehicleCard from "@/components/VehicleCard";
import VehiclesLeftSideBar from "@/components/VehiclesLeftSideBar";
import { VEHICLE_SUBSCRIPTION, VEHICLES_BY_DATE_RANGE } from "@/graphql/queries";
import { Vehicle } from "@/types/graphqlTypes";
import { useSubscription } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import React from "react";

function Cars() {
   const searchParams = useSearchParams();
   const from = searchParams.get("from");
   const to = searchParams.get("to");

   const { data, loading, error } = useSubscription(from && to ? VEHICLES_BY_DATE_RANGE : VEHICLE_SUBSCRIPTION, {
      variables: from && to ? { from, to } : {},
   });

   if (loading) return <Loading />;

   return (
      <div className="h-screen ">
         <Navbar />
         <div className="flex">
            <VehiclesLeftSideBar />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 w-full border-l">
               {!error && data && data.vehicles.map((vehicle: Vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
            </div>
         </div>
      </div>
   );
}

export default Cars;
