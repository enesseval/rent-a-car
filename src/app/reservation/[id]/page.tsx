"use client";

import Image from "next/image";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { useMutation, useQuery } from "@apollo/client";
import { BsInfoCircle } from "react-icons/bs";
import { FaChild, FaCheck } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { TbBabyCarriageFilled } from "react-icons/tb";
import { IoSpeedometer, IoCarSport } from "react-icons/io5";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { GiGearStickPattern, GiWallet } from "react-icons/gi";
import { BsFuelPumpFill, BsPersonCheckFill, BsPersonPlusFill, BsPersonFill } from "react-icons/bs";

import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Vehicle } from "@/types/graphqlTypes";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { ADD_RESERVATION_MUTATION, GET_VEHICLE_BY_ID, UPDATE_VEHICLE_AVALIABLE_MUTATION } from "@/graphql/queries";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ServiceKeys = "driver" | "babySeat" | "childSeat";

const getRandomNumberInRange = (min: number, max: number) => {
   return Math.random() * (max - min) + min;
};

function Reservation() {
   const router = useRouter();
   const { id } = useParams();
   const searchParams = useSearchParams();
   const from = searchParams.get("from");
   const to = searchParams.get("to");

   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [vehicle, setVehicle] = useState<Vehicle>();
   const [totalPrice, setTotalPrice] = useState<number>(0);
   const [birthday, setBirthday] = useState<Date>();
   const [selectedServices, setSelectedServices] = useState<Record<ServiceKeys, boolean>>({
      driver: false,
      babySeat: false,
      childSeat: false,
   });
   const [prices, setPrices] = useState<Record<ServiceKeys, number>>({
      driver: 0,
      babySeat: 0,
      childSeat: 0,
   });
   const [errors, setErrors] = useState({
      name: false,
      email: false,
      birthday: false,
   });

   useEffect(() => {
      const newPrices: Record<ServiceKeys, number> = {
         driver: parseFloat(getRandomNumberInRange(200, 300).toFixed(2)),
         babySeat: parseFloat(getRandomNumberInRange(500, 700).toFixed(2)),
         childSeat: parseFloat(getRandomNumberInRange(700, 1000).toFixed(2)),
      };

      setPrices(newPrices);
   }, []);

   var dateFrom, dateTo;

   if (from) dateFrom = new Date(from);
   if (to) dateTo = new Date(to);

   const { data, loading, error } = useQuery(GET_VEHICLE_BY_ID, { variables: { id } });
   const [updateVehicleAvaliable] = useMutation(UPDATE_VEHICLE_AVALIABLE_MUTATION, {
      variables: { id },
      onError: (error) => {
         console.log(error.message);
      },
   });
   const [addReservation] = useMutation(ADD_RESERVATION_MUTATION, {
      onCompleted: (data) => {
         toast({
            title: "Reservasyon başarıyla eklendi",
         });
         updateVehicleAvaliable({ variables: { id } });
         router.push(`/reservation/detail/${data.insert_reservations_one.id}`);
      },
      onError: (error) => {
         toast({
            title: "Reservasyon eklenirken bir hata oluştu",
            description: error.message,
            variant: "destructive",
         });
      },
   });

   useEffect(() => {
      if (!loading && !error && data) setVehicle(data.vehicles[0]);
   }, [data, loading, error]);

   const calculateDaysBetween = (fromDate: string, toDate: string) => {
      const start = new Date(fromDate);
      const end = new Date(toDate);

      const timeDiff = end.getTime() - start.getTime();

      return timeDiff / (1000 * 3600 * 24);
   };

   const daysBetween = from && to ? calculateDaysBetween(from, to) : 0;

   useEffect(() => {
      if (vehicle && daysBetween > 0) {
         const initialTotal = daysBetween * Number(vehicle.daily_price);
         setTotalPrice(initialTotal);
      }
   }, [vehicle, daysBetween]);

   const handleClick = (service: ServiceKeys) => {
      setSelectedServices((prevState) => {
         const isSelected = !prevState[service];
         const updatedServices = {
            ...prevState,
            [service]: isSelected,
         };

         const updatedTotal = Object.keys(updatedServices).reduce((acc, key) => {
            return updatedServices[key as ServiceKeys] ? acc + prices[key as ServiceKeys] : acc;
         }, daysBetween * Number(vehicle?.daily_price) || 0);

         setTotalPrice(Number(updatedTotal.toFixed(2))); // 2 ondalık basamakta yuvarlama

         return updatedServices;
      });
   };

   const handlePaymentClick = () => {
      const newErrors = {
         name: !name.trim(),
         email: !email.trim(),
         birthday: !birthday,
      };
      setErrors(newErrors);

      if (!newErrors.name && !newErrors.email && !newErrors.birthday) {
         addReservation({
            variables: {
               id: nanoid(),
               vehicle_id: id,
               start_date: from,
               end_date: to,
               total_price: totalPrice,
               driver_name: name,
               driver_tcno: "11111111111",
               driver_mail: email,
               driver_phone: "5555555555",
               driver_birthday: birthday,
               payment_status: false,
            },
         });
      }
   };

   if (loading) return <Loading />;

   return (
      <div>
         <Navbar />
         {!error && !loading && data && vehicle && (
            <div className="w-full">
               <div className="grid grid-cols-3 md:grid-cols-5 gap-3 max-w-[1100px] mx-auto p-2 relative">
                  {/* Araç kartı */}
                  <div className="col-span-3 p-2 border rounded-lg self-start">
                     <h1 className="text-xl font-bold m-2">Araç ve teslim bilgileri</h1>
                     <Separator />
                     <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 sm:col-span-1 relative aspect-video">
                           <Image className="object-contain" priority src={vehicle.image} alt={vehicle.id} fill sizes="(max-width: 646px) 100vw, 33vw" />
                        </div>
                        <div className="col-span-2 sm:col-span-2">
                           <div className="w-full sm:mt-3 flex flex-col justify-center sm:items-start items-center">
                              <div className="">
                                 <h1 className="text-2xl">
                                    {vehicle.brand.name} {vehicle.model.name}
                                 </h1>
                              </div>
                              <div className="grid grid-cols-3 w-full p-4 md:p-2 gap-2 sm:justify-items-start">
                                 <span className="flex flex-col justify-center items-center col-span-1">
                                    <GiGearStickPattern className="w-5 h-5 mr-2" />
                                    {vehicle.gear.charAt(0).toUpperCase() + vehicle.gear.slice(1)}
                                 </span>
                                 <span className="flex flex-col justify-center items-center col-span-1">
                                    <BsFuelPumpFill className="w-5 h-5 mr-2" />
                                    {vehicle.fuel.charAt(0).toUpperCase() + vehicle.fuel.slice(1)}
                                 </span>
                                 <span className="flex flex-col justify-center items-center col-span-1">
                                    <BsPersonCheckFill className="w-5 h-5 mr-2" />
                                    21+
                                 </span>
                                 <span className="flex flex-col justify-center items-center col-span-1">
                                    <IoSpeedometer className="w-5 h-5 mr-2" />
                                    {400 * daysBetween} km
                                 </span>
                                 <span className="flex flex-col justify-center items-center col-span-1">
                                    <GiWallet className="w-5 h-5 mr-2" />
                                    2000₺
                                 </span>
                              </div>
                           </div>
                        </div>
                        <div className="col-span-3 row-span-1">
                           <Separator />
                           <div className="w-full h-full flex justify-center items-center md:justify-around">
                              <div className="flex p-2">
                                 <p>
                                    <IoCarSport className="w-5 h-5" />
                                 </p>
                                 <div className="px-2">
                                    <p>Teslim Alış</p>
                                    <p>{format(dateFrom ? dateFrom : "", "d MMMM yyyy", { locale: tr })}</p>
                                    <p>Eskişehir Ofis</p>
                                 </div>
                              </div>
                              <div className="flex p-2">
                                 <p>
                                    <IoCarSport className="w-5 h-5" />
                                 </p>
                                 <div className="px-2">
                                    <p>Teslim Ediş</p>
                                    <p>{format(dateTo ? dateTo : "", "d MMMM yyyy", { locale: tr })}</p>
                                    <p>Eskişehir Ofis</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  {/* Ödeme bilgileri */}
                  <div className="col-span-3 md:col-span-2 order-last md:order-none">
                     <div className="col-span-3 md:col-span-2 border rounded-lg p-5 order-last md:order-none">
                        <h1 className="text-xl font-bold mb-3">Toplam tutar</h1>
                        <Separator />
                        <h1 className="text-lg mt-5">
                           {daysBetween} günlük toplam tutar: <span>{daysBetween * Number(vehicle?.daily_price)}₺</span>
                        </h1>
                        <p className="text-xs mt-3 mb-5">Günlük kiralama tutarı: {Number(vehicle?.daily_price)}₺</p>
                        <Separator />
                        <div className="w-full border rounded-md mt-10 mx-auto p-3 flex bg-slate-200 dark:bg-slate-800">
                           <BsInfoCircle className="w-4 h-4 mr-2 mt-1 animate-info text-red-600" />
                           <div className="max-w-[80%]">
                              <p>
                                 Araç teslimatı sırasında tahsil edilecek depozito ücreti için <span className="font-bold">kendi adınıza ait kredi kartınızı, kimliğinizi ve ehliyetinizi</span>{" "}
                                 yanınızda bulundurmalısınız.
                              </p>
                           </div>
                        </div>
                        <div className="md:absolute md:bottom-4 md:right-4 md:border md:rounded-lg md:p-2">
                           <div className="w-full mt-3 md:mt-0 space-y-3 md:space-y-0 flex flex-col justify-center md:flex-row md:items-center md:space-x-3">
                              <p>Toplam tutar: {totalPrice}₺</p>
                              <Button onClick={handlePaymentClick} variant={"outline"}>
                                 Ödemeye geç
                                 <MdKeyboardArrowRight className="text-green-700 w-7 h-7" />
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
                  {/* Ek hizmetler */}
                  <div className="col-span-3 md:col-span-5 space-y-1">
                     <h1 className="text-2xl font-bold px-5 py-2">Ek hizmetler</h1>
                     <div className="grid grid-cols-2 border rounded-lg p-3">
                        <div className="flex items-center">
                           <div className="rounded-full p-3 bg-slate-200 dark:bg-slate-900">
                              <BsPersonPlusFill className="w-10 h-10" />
                           </div>
                           <div className="ml-3 flex flex-col justify-center">
                              <h1 className="font-bold">Ek sürücü</h1>
                              <p>Aracı sizden başka kişilerinde kullanmasına izin verir.</p>
                           </div>
                        </div>
                        <div className="flex space-x-3 justify-end items-center">
                           <span className="font-bold">{prices.driver}₺</span>
                           <Button variant={"outline"} onClick={() => handleClick("driver")} className={`relative px-4 py-2 border-2 transition-all duration-300`}>
                              <span className={`transition-opacity duration-300 ${selectedServices.driver ? "opacity-0" : "opacity-100"}`}>Ekle</span>
                              <span
                                 className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl transition-all duration-300 ${
                                    selectedServices.driver ? "scale-100 opacity-100" : "scale-0 opacity-0"
                                 }`}
                              >
                                 <FaCheck />
                              </span>
                           </Button>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 border rounded-lg p-3">
                        <div className="flex items-center">
                           <div className="rounded-full p-3 bg-slate-200 dark:bg-slate-900">
                              <TbBabyCarriageFilled className="w-10 h-10" />
                           </div>
                           <div className="ml-3 flex flex-col justify-center">
                              <h1 className="font-bold">Bebek koltuğu</h1>
                              <p>0-4 yaş grubu ve 0-16 kg&apos;a kadar olan çocuklar için bebek koltuğu alabilirsiniz.</p>
                           </div>
                        </div>
                        <div className="flex space-x-3 justify-end items-center">
                           <span className="font-bold">{prices.babySeat}₺</span>
                           <Button variant={"outline"} onClick={() => handleClick("babySeat")} className={`relative px-4 py-2 border-2 transition-all duration-300`}>
                              <span className={`transition-opacity duration-300 ${selectedServices.babySeat ? "opacity-0" : "opacity-100"}`}>Ekle</span>
                              <span
                                 className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl transition-all duration-300 ${
                                    selectedServices.babySeat ? "scale-100 opacity-100" : "scale-0 opacity-0"
                                 }`}
                              >
                                 <FaCheck />
                              </span>
                           </Button>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 border rounded-lg p-3">
                        <div className="flex items-center">
                           <div className="rounded-full p-3 bg-slate-200 dark:bg-slate-900">
                              <FaChild className="w-10 h-10" />
                           </div>
                           <div className="ml-3 flex flex-col justify-center">
                              <h1 className="font-bold">Çocuk koltuğu</h1>
                              <p>4-8 yaş grubu ve 17-30 kg&apos;a kadar olan çocuklar için koltuk alabilirsiniz.</p>
                           </div>
                        </div>
                        <div className="flex space-x-3 justify-end items-center">
                           <span className="font-bold">{prices.childSeat}₺</span>
                           <Button variant={"outline"} onClick={() => handleClick("childSeat")} className={`relative px-4 py-2 border-2 transition-all duration-300`}>
                              <span className={`transition-opacity duration-300 ${selectedServices.childSeat ? "opacity-0" : "opacity-100"}`}>Ekle</span>
                              <span
                                 className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl transition-all duration-300 ${
                                    selectedServices.childSeat ? "scale-100 opacity-100" : "scale-0 opacity-0"
                                 }`}
                              >
                                 <FaCheck />
                              </span>
                           </Button>
                        </div>
                     </div>
                  </div>
                  {/* Sürücü bilgileri */}
                  <div className="col-span-3 md:col-span-5 border rounded-lg p-2">
                     <div className="flex items-center space-x-3">
                        <BsPersonFill className="w-8 h-8" />
                        <h1 className="text-xl font-bold">Sürücü bilgileri</h1>
                     </div>
                     <Separator className="mt-2" />
                     <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2 sm:col-span-1 space-y-2 mt-5">
                           <Label htmlFor="name">Ad Soyad</Label>
                           <Input onChange={(e) => setName(e.target.value)} value={name} className={errors.name ? "border-red-500" : ""} id="name" placeholder="Ad Soyad" />
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-2 sm:mt-5">
                           <Label htmlFor="tcno">Tc Kimlik Numarası</Label>
                           <Input id="tcno" value={11111111111} readOnly />
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-2">
                           <Label htmlFor="tcno">Telefon Numarası</Label>
                           <Input id="phone_number" value={55555555555} readOnly />
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-2 flex-col mt-3">
                           <Label htmlFor="birthday" className="block">
                              Doğum Tarihi
                           </Label>
                           <Popover>
                              <PopoverTrigger id="birthday" asChild>
                                 <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !setBirthday && "text-muted-foreground", errors.birthday && "border-red-500")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {birthday ? format(birthday, "PPP") : <span>Doğum tarihi seçiniz.</span>}
                                 </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                 <Calendar mode="single" selected={birthday} onSelect={setBirthday} initialFocus />
                              </PopoverContent>
                           </Popover>
                        </div>
                        <div className="col-span-2 sm:col-span-1 space-y-2">
                           <Label htmlFor="e_mail">E-posta</Label>
                           <Input onChange={(e) => setEmail(e.target.value)} value={email} className={errors.email ? "border-red-500" : ""} id="e_mail" />
                           <p className="text-xs text-muted-foreground">Rezervasyon bilgilerinizi mail adresinize göndereceğiz.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default Reservation;
