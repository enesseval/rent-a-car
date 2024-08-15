"use client";

import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import Brands from "@/components/Brands";
import Models from "@/components/Models";
import Vehicles from "@/components/Vehicles";
import { auth } from "@/services/firebaseConfig";
import Categories from "@/components/Categories";
import AdminPageSideBar from "@/components/AdminPageSideBar";
import Reservations from "@/components/Reservations";
import Dashboard from "@/components/Deashboard";

const AdminPage: React.FC = () => {
   const router = useRouter();
   const [sidebarOpen, setSidebarOpen] = useState(true);
   const [activeTab, setActiveTab] = useState("dashboard");
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
         if (!user) router.push("/admin/login");
         else setIsAuthenticated(true);
      });
      return () => unsubscribe();
   }, [router]);

   if (!isAuthenticated) return null;

   const renderContent = () => {
      switch (activeTab) {
         case "dashboard":
            return <Dashboard />;
         case "brands":
            return <Brands />;
         case "models":
            return <Models />;
         case "categories":
            return <Categories />;
         case "vehicles":
            return <Vehicles />;
         case "reservations":
            return <Reservations />;
      }
   };

   return (
      <div className="flex">
         <AdminPageSideBar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} setActiveTab={setActiveTab} />
         <div className={cn("flex-grow p-5 duration-500", sidebarOpen ? "ml-[250px]" : "ml-[25px]")}>{renderContent()}</div>
      </div>
   );
};

export default AdminPage;
