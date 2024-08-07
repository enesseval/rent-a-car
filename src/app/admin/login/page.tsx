"use client";

import { z } from "zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/services/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
   email: z.string().email({ message: "Invalid email address" }),
   password: z.string({ message: "Password is required" }),
});

function AdminLogin() {
   const router = useRouter();
   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
   });

   function onSubmit(values: z.infer<typeof formSchema>) {
      try {
         signInWithEmailAndPassword(auth, values.email, values.password).then(async (userCredential) => {
            localStorage.setItem("token", await userCredential.user.getIdToken());
            router.push("/admin");
         });
      } catch (error) {
         console.log("Login failed: ", error);
      }
   }

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
         if (user) {
            router.push("/admin");
         }
      });
      return () => unsubscribe();
   }, [router]);

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full h-svh flex items-center justify-center">
               <div className="border rounded-lg">
                  <Card className="w-[350px]">
                     <CardHeader>
                        <CardTitle>Login for admin page</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="grid w-full items-center gap-4">
                           <div className="flex flex-col space-y-1.5">
                              <FormField
                                 control={form.control}
                                 name="email"
                                 render={({ field }) => (
                                    <FormItem>
                                       <Label htmlFor="email">E-mail</Label>
                                       <FormControl>
                                          <Input id="email" placeholder="Enter your email address." onChange={field.onChange} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                           </div>
                           <div className="flex flex-col space-y-1.5">
                              <FormField
                                 control={form.control}
                                 name="password"
                                 render={({ field }) => (
                                    <FormItem>
                                       <Label htmlFor="password">Password</Label>
                                       <FormControl>
                                          <Input type="password" id="password" placeholder="Enter your pasword." onChange={field.onChange} />
                                       </FormControl>
                                       <FormMessage />
                                    </FormItem>
                                 )}
                              />
                           </div>
                        </div>
                     </CardContent>
                     <CardFooter className="flex justify-center">
                        <Button type="submit" variant={"outline"}>
                           Login
                        </Button>
                     </CardFooter>
                  </Card>
               </div>
            </div>
         </form>
      </Form>
   );
}

export default AdminLogin;
