"use client";
import { GET_VEHICLE_BY_ID } from "@/graphql/queries";
import { useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import React from "react";

function Reservation() {
   const { id } = useParams();
   console.log(id);

   const { data, loading, error } = useQuery(GET_VEHICLE_BY_ID, { variables: { id } });

   console.log(data, "data");
   console.log(error, "error");

   return <div>page</div>;
}

export default Reservation;
