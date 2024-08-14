"use client";
import { useTheme } from "next-themes";
import { IoMoon } from "react-icons/io5";
import { PiSunFill } from "react-icons/pi";
import React, { useEffect, useState } from "react";

import { Button } from "./ui/button";

function ThemeSwitcher() {
   const [mounted, setMounted] = useState(false);
   const { theme, setTheme } = useTheme();

   useEffect(() => setMounted(true), []);

   const themeChange = () => {
      if (theme === "light") setTheme("dark");
      else setTheme("light");
   };

   if (!mounted) return null;

   return (
      <Button size={"icon"} variant={"outline"} onClick={() => themeChange()}>
         {theme === "dark" ? <PiSunFill className="w-6 h-6 animate-wiggle" /> : <IoMoon className="w-6 h-6 animate-wiggle" />}
      </Button>
   );
}

export default ThemeSwitcher;
