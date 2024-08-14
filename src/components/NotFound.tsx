import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

function NotFound() {
   const router = useRouter();
   return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
         <h1>Bir hata oluştu.</h1>
         <p>Sanırım aradığınız şey burda değil.</p>
         <Button className="mt-5" onClick={() => router.push("/")} variant={"outline"}>
            Ana sayfaya dönmek için lütfen tıklayınız.
         </Button>
      </div>
   );
}

export default NotFound;
