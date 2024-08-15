import React from "react";
import { signOut } from "firebase/auth";
import { CiLogout } from "react-icons/ci";
import { GoDotFill } from "react-icons/go";
import { useRouter } from "next/navigation";
import { auth } from "@/services/firebaseConfig";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import ThemeSwitcher from "./ThemeSwitcher";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface Props {
   isOpen: boolean;
   toggleSidebar: () => void;
   setActiveTab: (tab: string) => void;
}

const AdminPageSideBar: React.FC<Props> = ({ isOpen, toggleSidebar, setActiveTab }) => {
   const router = useRouter();
   const handleSignout = () => {
      signOut(auth)
         .then(() => {
            console.log("başarıyla çıkış yapıldı");
            router.push("/");
         })
         .catch((e) => console.log("bir hata oluştu: ", e));
   };

   return (
      <nav className={cn("fixed top-0 left-0 h-full w-[250px] bg-slate-100 dark:bg-slate-900 duration-500 z-50", !isOpen && "w-6")}>
         <header className="relative max-h-[96px]">
            <div className="p-5 flex justify-center">
               <span className={cn("text-xl font-bold text-center delay-300", !isOpen && "invisible delay-0")}>
                  Araba Kirala <br />
                  Admin Sayfası
               </span>
            </div>
            <Button onClick={toggleSidebar} variant={"outline"} size={"icon"} className="absolute rounded-full top-1/3 -right-[18px]">
               {isOpen ? <IoIosArrowBack className="w-4 h-4" /> : <IoIosArrowForward className="w-4 h-4" />}
            </Button>
         </header>
         <div className={cn("absolute bottom-2 flex justify-evenly w-full delay-300", !isOpen && "invisible delay-0")}>
            <ThemeSwitcher />
            <Button className="z-10" size={"icon"} variant={"outline"} onClick={() => handleSignout()}>
               <CiLogout className="w-6 h-6" />
            </Button>
         </div>
         <Separator className={!isOpen ? "invisible" : ""} />
         <div className={cn("p-5 delay-300", !isOpen && "invisible delay-0")}>
            <ul className="flex flex-col space-y-2 text-lg">
               <li onClick={() => setActiveTab("dashboard")} className="hover:text-slate-600 cursor-pointer inline-flex items-center">
                  <GoDotFill className="mr-2" />
                  Dashboard
               </li>
               <li onClick={() => setActiveTab("brands")} className="hover:text-slate-600 cursor-pointer inline-flex items-center">
                  <GoDotFill className="mr-2" />
                  Markalar
               </li>
               <li onClick={() => setActiveTab("models")} className="hover:text-slate-600 cursor-pointer inline-flex items-center">
                  <GoDotFill className="mr-2" />
                  Modeller
               </li>
               <li onClick={() => setActiveTab("categories")} className="hover:text-slate-600 cursor-pointer inline-flex items-center">
                  <GoDotFill className="mr-2" />
                  Kategoriler
               </li>
               <li onClick={() => setActiveTab("vehicles")} className="hover:text-slate-600 cursor-pointer inline-flex items-center">
                  <GoDotFill className="mr-2" />
                  Araçlar
               </li>
               <li onClick={() => setActiveTab("reservations")} className="hover:text-slate-600 cursor-pointer inline-flex items-center">
                  <GoDotFill className="mr-2" />
                  Reservasyonlar
               </li>
            </ul>
         </div>
      </nav>
   );
};

export default AdminPageSideBar;
