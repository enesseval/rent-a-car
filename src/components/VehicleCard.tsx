import { Vehicle } from "@/types/graphqlTypes";
import React from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Loading from "./Loading";
import { Button } from "./ui/button";
import { GiGearStickPattern } from "react-icons/gi";
import { BsFuelPumpFill } from "react-icons/bs";

interface VehicleCardProps {
   vehicle: Vehicle;
}

function VehicleCard({ vehicle }: VehicleCardProps) {
   console.log(vehicle);
   if (!vehicle) return <Loading />;
   return (
      <Card className="relative overflow-hidden bg-contain bg-no-repeat" style={{ backgroundImage: `url(${vehicle.image})`, height: "300px" }}>
         <div className="absolute inset-0 bg-black bg-opacity-10"></div>
         <CardHeader className="relative z-10 flex items-center">
            <CardTitle>
               {vehicle.brand.name} {vehicle.model.name}
            </CardTitle>
         </CardHeader>
         <CardFooter className="flex flex-col bottom-12 absolute z-10 w-full p-0 m-0">
            <div className="w-full h-10 p-2 grid grid-cols-2 gap-2 justify-between items-center">
               <span className="flex order-1">
                  <GiGearStickPattern className="w-5 h-5 mr-2" />
                  {vehicle.gear.charAt(0).toUpperCase() + vehicle.gear.slice(1)}
               </span>
               <span className="flex order-3">
                  <BsFuelPumpFill className="w-5 h-5 mr-2" />
                  {vehicle.fuel.charAt(0).toUpperCase() + vehicle.fuel.slice(1)}
               </span>
               <h1 className="order-2 text-right">{vehicle.daily_price.toString()} ₺</h1>
               <div className="order-4 flex justify-end">
                  <Button className="max-w-[100px]" variant={"outline"}>
                     Kirala
                  </Button>
               </div>
            </div>
         </CardFooter>
      </Card>
   );
}

export default VehicleCard;
