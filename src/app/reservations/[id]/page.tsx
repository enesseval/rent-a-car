"use client";

import { useParams } from "next/navigation";
import React from "react";

function RezervationDetail() {
   const { id } = useParams();

   console.log(id);
   return <div>RezervationDetail</div>;
}

export default RezervationDetail;
