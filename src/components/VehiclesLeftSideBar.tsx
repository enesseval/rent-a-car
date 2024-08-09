import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaFilter } from "react-icons/fa";
import { cn } from "@/lib/utils";

function VehiclesLeftSideBar() {
   const [isMobile, setIsMobile] = useState(false);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth < 768) {
            setIsMobile(true);
            setIsSidebarOpen(false);
         } else {
            setIsMobile(false);
            setIsSidebarOpen(true);
         }
      };

      window.addEventListener("resize", handleResize);

      handleResize();

      return () => window.removeEventListener("resize", handleResize);
   }, []);

   const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
   };

   return (
      <>
         {isMobile && (
            <Button size={"icon"} variant={"outline"} onClick={toggleSidebar} className="absolute top-5 right-12 translate-y-0">
               <FaFilter className="w-5 h-5" />
            </Button>
         )}
         <div className="relative">
            <div
               className={cn(
                  "fixed top-0 left-0 w-full md:w-[250px] transition-transform duration-300 md:relative md:translate-x-0 z-50",
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                  isMobile && "bg-white dark:bg-black"
               )}
            >
               <h2 className="p-4 text-center">Filtrele</h2>

               <div className="p-4">Content goes here...</div>
               <Button variant={"outline"} onClick={() => toggleSidebar()}>
                  Kapat
               </Button>
            </div>
         </div>
      </>
   );
}

export default VehiclesLeftSideBar;
