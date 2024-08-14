import React, { useState, useEffect } from "react";
import { useSubscription } from "@apollo/client";
import { SelectValue } from "@radix-ui/react-select";

import { cn } from "@/lib/utils";
import { FaFilter } from "react-icons/fa";
import { Separator } from "./ui/separator";
import { Button } from "@/components/ui/button";
import { BrandCount, Model } from "@/types/graphqlTypes";
import { BRANDS_COUNT_SUBS, MODELS_SUBSCRIPTION_BY_ID } from "@/graphql/queries";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "./ui/select";

function VehiclesLeftSideBar({ onFilter }: any) {
   const [brandId, setBrandId] = useState("");
   const [modelId, setModelId] = useState("");
   const [fuelType, setFuelType] = useState("");
   const [gearType, setGearType] = useState("");
   const [priceRange, setPriceRange] = useState("");
   const [isMobile, setIsMobile] = useState(false);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [sortedBrandData, setSortedBrandData] = useState<BrandCount[]>();

   const { data: brandCountData, loading: brandCountLoading, error: brandCountError } = useSubscription(BRANDS_COUNT_SUBS);
   const { data: modelData, loading: modelLoading, error: modelError } = useSubscription(MODELS_SUBSCRIPTION_BY_ID, { variables: { brand_id: brandId } });

   var modelsLength;
   if (modelData) modelsLength = modelData.models.length;

   useEffect(() => {
      //veritabanında graphql ile sorgulama yaptığımda önce order_by sonra where sorgusundan dolayı sıralama bozuluyodu bu şekilde çözdüm.
      var sort;
      if (brandCountData) sort = brandCountData.brands.sort((a: BrandCount, b: BrandCount) => b.vehicles_aggregate.aggregate.count - a.vehicles_aggregate.aggregate.count);
      setSortedBrandData(sort);
   }, [brandCountData]);

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

   const handleFilter = () => {
      const pRange = getPriceRange(priceRange);
      const filters = {
         brand_id: brandId || "",
         model_id: modelId || "",
         fuel: fuelType || "",
         gear: gearType || "",
         daily_price: pRange || "",
      };
      onFilter(filters);
   };

   const resetFilter = () => {
      onFilter();
      setBrandId("");
      setModelId("");
      setFuelType("");
      setGearType("");
      setPriceRange("");
   };

   const getPriceRange = (range: string) => {
      switch (range) {
         case "1":
            return { _gte: "1000", _lte: "2000" };
         case "2":
            return { _gte: "2000", _lte: "3000" };
         case "3":
            return { _gte: "3000", _lte: "4000" };
         case "4":
            return { _gte: "4000", _lte: "5000" };
         case "5":
            return { _gte: "5000" };
      }
   };

   return (
      <>
         {isMobile && (
            <Button size={"icon"} variant={"outline"} onClick={toggleSidebar} className="absolute top-5 right-12 translate-y-0">
               <FaFilter className="w-5 h-5" />
            </Button>
         )}
         <div className="relative min-h-[100%] md:border-r">
            <div
               className={cn(
                  "fixed top-0 h-full left-0 w-full md:w-[250px] transition-transform duration-300 md:relative md:translate-x-0 z-50",
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                  isMobile && "bg-white dark:bg-black"
               )}
            >
               <div className="mt-5 space-y-3 max-w-[95%] mx-auto h-screen">
                  <div className="sticky space-y-3 top-0">
                     <h2 className="text-center">Filtrele</h2>
                     <Separator />
                     <Select value={brandId} onValueChange={(value) => setBrandId(value)}>
                        <SelectTrigger>
                           <SelectValue placeholder="Bir marka seçiniz." />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectGroup>
                              {!brandCountLoading &&
                                 !brandCountError &&
                                 sortedBrandData &&
                                 sortedBrandData.map((brand: BrandCount) => (
                                    <SelectItem value={brand.id} key={brand.id}>
                                       {brand.name}
                                    </SelectItem>
                                 ))}
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                     <Select value={modelId} disabled={brandId === ""} onValueChange={(value) => setModelId(value)}>
                        <SelectTrigger>
                           <SelectValue placeholder={brandId === "" ? "Lütfen önce bir marka seçiniz" : modelsLength === 0 ? "Bu markada henüz bir model eklenmemiş" : "Bir model seçiniz"} />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectGroup>
                              {!modelLoading &&
                                 !modelError &&
                                 modelData &&
                                 modelData.models.map((model: Model) => (
                                    <SelectItem key={model.id} value={model.id}>
                                       {model.name}
                                    </SelectItem>
                                 ))}
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                     <Select value={fuelType} onValueChange={(value) => setFuelType(value)}>
                        <SelectTrigger id="fuel">
                           <SelectValue placeholder="Yakıt tipi seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectGroup>
                              <SelectItem value="benzin">Benzinli</SelectItem>
                              <SelectItem value="dizel">Dizel</SelectItem>
                              <SelectItem value="elektrikli">Elektrikli</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                     <Select value={gearType} onValueChange={(value) => setGearType(value)}>
                        <SelectTrigger id="gear">
                           <SelectValue placeholder="Vites tipi seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectGroup>
                              <SelectItem value="otomatik">Otomatik</SelectItem>
                              <SelectItem value="manuel">Manuel</SelectItem>
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                     <Select value={priceRange} onValueChange={(value) => setPriceRange(value)}>
                        <SelectTrigger>
                           <SelectValue placeholder="Fiyat aralığı seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectGroup>
                              <SelectItem value="1">1000-2000₺</SelectItem>
                              <SelectItem value="2">2000-3000₺</SelectItem>
                              <SelectItem value="3">3000-4000₺</SelectItem>
                              <SelectItem value="4">4000-5000₺</SelectItem>
                              <SelectItem value="5">5000₺ den falza</SelectItem>
                           </SelectGroup>
                        </SelectContent>
                     </Select>
                     <div className="flex flex-col justify-center w-full">
                        <Button variant={"outline"} onClick={handleFilter}>
                           Filtrele
                        </Button>
                     </div>
                     <div className="flex flex-col justify-center w-full">
                        <Button variant={"outline"} onClick={resetFilter}>
                           Filtreleri sıfırla
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}

export default VehiclesLeftSideBar;
