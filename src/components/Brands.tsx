import { nanoid } from "nanoid";
import React, { useState } from "react";
import { TiDelete } from "react-icons/ti";
import { MdModeEdit } from "react-icons/md";
import { useMutation, useSubscription } from "@apollo/client";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "./ui/alert-dialog";
import Loading from "./Loading";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Brand } from "@/types/graphqlTypes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ADD_BRAND_MUTATION, BRANDS_SUBSCRIPTIONS, DELETE_BRAND, UPDATE_BRAND_MUTATION } from "@/graphql/queries";

function Brands() {
   const { toast } = useToast();
   const [brand, setBrand] = useState("");
   const [open, setOpen] = useState(false);
   const [brandSubmitError, setBrandSubmitError] = useState("");
   const [editing, setEditing] = useState<Brand | null>(null);
   const { data, loading, error } = useSubscription(BRANDS_SUBSCRIPTIONS);
   const [addBrand] = useMutation(ADD_BRAND_MUTATION, {
      onCompleted: () => {
         toast({
            title: "Marka başarıyla eklendi",
         });
         setBrand("");
         setOpen(false);
         setEditing(null);
      },
      onError: (error) => {
         toast({
            title: "Marka eklenirken bir hata oluştu",
            description: error.message,
            variant: "destructive",
         });
      },
   });
   const [updateBrand] = useMutation(UPDATE_BRAND_MUTATION, {
      onCompleted: () => {
         toast({
            title: "Marka başarıyla güncellendi",
         });
         setBrand("");
         setOpen(false);
         setEditing(null);
      },
      onError: (error) => {
         toast({
            title: "Marka güncellenirken bir hata oluştu",
            description: error.message,
            variant: "destructive",
         });
      },
   });
   const [deleteBrand] = useMutation(DELETE_BRAND, {
      onCompleted: () => {
         toast({
            title: "Marka başarıyla silindi",
         });
         setBrand("");
         setOpen(false);
         setEditing(null);
      },
      onError: (error) => {
         toast({
            title: "Marka silinirken bir hata oluştu",
            description: error.message,
            variant: "destructive",
         });
      },
   });

   const handleSubmit = () => {
      if (brand.trim() === "") {
         setBrandSubmitError("Bu alan zorunludur.");
         return;
      }
      if (editing) updateBrand({ variables: { id: editing.id, name: brand } });
      else addBrand({ variables: { id: nanoid(), name: brand } });

      setBrand("");
      setOpen(false);
      setEditing(null);
   };

   const handleBrandEdit = (brand: Brand) => {
      setBrand(brand.name);
      setEditing(brand);
      setOpen(true);
   };

   const handleDialogClose = () => {
      setBrand("");
      setEditing(null);
   };

   const handleBrandDelete = (id: string) => {
      deleteBrand({ variables: { id } });
   };

   if (loading) return <Loading />;

   return (
      <div className="w-full relative">
         <div className="absolute z-50 top-5 right-5">
            <Dialog
               open={open}
               onOpenChange={(isOpen) => {
                  setOpen(isOpen);
                  if (!isOpen) handleDialogClose();
               }}
            >
               <DialogTrigger asChild>
                  <Button onClick={() => setEditing(null)} variant={"outline"}>
                     Marka Ekle
                  </Button>
               </DialogTrigger>
               <DialogContent aria-describedby={undefined} className="max-w-[350px]">
                  <DialogHeader>
                     <DialogTitle>{editing ? "Düzenle" : "Bir araç markası ekle"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="brand" className="text-right">
                           Marka
                        </Label>
                        <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className={cn("col-span-3", brandSubmitError && "border-red-500")} />
                     </div>
                  </div>
                  <DialogFooter className="w-full flex flex-col items-end">
                     <Button onClick={() => handleSubmit()} className="max-w-[100px]" type="submit">
                        {editing ? "Düzenle" : "Ekle"}
                     </Button>
                  </DialogFooter>
               </DialogContent>
            </Dialog>
         </div>

         {!loading && !error && (
            <Table className="mt-20 max-w-[600px] mx-auto">
               <TableHeader>
                  <TableRow>
                     <TableHead>Markalar</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data &&
                     data.brands.map((brand: Brand) => (
                        <TableRow key={brand.id}>
                           <TableCell className="flex items-center">{brand.name}</TableCell>
                           <TableCell className="text-right">
                              <div className="flex justify-end">
                                 <div>
                                    <Button onClick={() => handleBrandEdit(brand)} className="ml-2" size={"icon"} variant={"outline"}>
                                       <MdModeEdit className="w-4 h-4" />
                                    </Button>
                                 </div>
                                 <div>
                                    <AlertDialog>
                                       <AlertDialogTrigger asChild>
                                          <Button className="ml-2" size={"icon"} variant={"destructive"}>
                                             <TiDelete className="w-6 h-6" />
                                          </Button>
                                       </AlertDialogTrigger>
                                       <AlertDialogContent>
                                          <AlertDialogHeader>
                                             <AlertDialogTitle>Bu markayı silmek istediğinize emin misiniz?</AlertDialogTitle>
                                             <AlertDialogDescription>Bu işlem geri alınamaz yine de devam etmek istiyor musunuz?</AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                             <AlertDialogCancel>Hayır</AlertDialogCancel>
                                             <AlertDialogAction onClick={() => handleBrandDelete(brand.id)}>Evet</AlertDialogAction>
                                          </AlertDialogFooter>
                                       </AlertDialogContent>
                                    </AlertDialog>
                                 </div>
                              </div>
                           </TableCell>
                        </TableRow>
                     ))}
               </TableBody>
            </Table>
         )}
      </div>
   );
}

export default Brands;
