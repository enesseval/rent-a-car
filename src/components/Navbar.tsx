import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { Separator } from "./ui/separator";

function Navbar() {
   return (
      <>
         <div className="flex items-center justify-center h-20 relative">
            <h1 className="text-4xl font-bold">Araç Kirala</h1>
            <div className="absolute top-5 right-2">
               <ThemeSwitcher />
            </div>
         </div>
         <Separator />
      </>
   );
}

export default Navbar;
