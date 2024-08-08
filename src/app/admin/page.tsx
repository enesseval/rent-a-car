"use client";
import AdminPageSideBar from "@/components/AdminPageSideBar";
import Brands from "@/components/Brands";
import Models from "@/components/Models";
import { cn } from "@/lib/utils";
import { auth } from "@/services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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
            return <div>Dashboard</div>;
         case "brands":
            return <Brands />;
         case "models":
            return <Models />;
         case "categories":
            return <div>categories</div>;
         case "reservations":
            return <div>reservations</div>;
         case "payments":
            return <div>payments</div>;
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
