import { nanoid } from "nanoid";
import React, { useState } from "react";
import { TiDelete } from "react-icons/ti";
import { MdModeEdit } from "react-icons/md";
import { useMutation, useSubscription } from "@apollo/client";

import Loading from "./Loading";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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
import { useToast } from "./ui/use-toast";
import { Brand, Model } from "@/types/graphqlTypes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ADD_MODEL_MUTATION, BRANDS_SUBSCRIPTIONS, DELETE_MODEL, GET_BRANDS, MODELS_SUBSCRIPTION, UPDATE_MODEL_MUTATION } from "@/graphql/queries";

function Models() {
   const { toast } = useToast();
   const [open, setOpen] = useState(false);
   const [model, setModel] = useState("");
   const [brand, setBrand] = useState("");
   const [modelInputError, setModelInputError] = useState("");
   const [editing, setEditing] = useState<Model | null>(null);

   const { data: brandData } = useSubscription(BRANDS_SUBSCRIPTIONS);
   const { data, loading, error } = useSubscription(MODELS_SUBSCRIPTION);
   const [addModel] = useMutation(ADD_MODEL_MUTATION, {
      onCompleted: () => {
         toast({
            title: "Model başarıyla eklendi",
         });
         setModel("");
         setBrand("");
         setOpen(false);
         setEditing(null);
      },
      onError: (error) => {
         toast({
            title: "Model eklenirken bir hata oluştu",
            description: error.message,
            variant: "destructive",
         });
      },
   });
   const [updateModel] = useMutation(UPDATE_MODEL_MUTATION, {
      onCompleted: () => {
         toast({
            title: "Model başarıyla güncellendi",
         });
         setModel("");
         setBrand("");
         setOpen(false);
         setEditing(null);
      },
      onError: (error) => {
         toast({
            title: "Model güncellenirken bir hata oluştu",
            description: error.message,
            variant: "destructive",
         });
      },
   });

   const [deleteModel] = useMutation(DELETE_MODEL, {
      onCompleted: () => {
         toast({
            title: "Model başarıyla silindi",
         });
         setModel("");
         setBrand("");
         setOpen(false);
         setEditing(null);
      },
      onError: (error) => {
         toast({
            title: "Model silinirken bir hata oluştu",
            description: error.message,
            variant: "destructive",
         });
      },
   });

   const handleSubmit = () => {
      if (model.trim() === "") {
         setModelInputError("Bu alanı doldurmalısınız.");
         return;
      }
      if (editing) updateModel({ variables: { id: editing.id, name: model, brand_id: brand } });
      else addModel({ variables: { id: nanoid(), name: model, brand_id: brand } });

      setBrand("");
      setModel("");
      setEditing(null);
      setOpen(false);
   };

   const handleModelEdit = (model: Model) => {
      setModel(model.name);
      setBrand(model.brand.id);
      setEditing(model);
      setOpen(true);
   };

   const handleDialogClose = () => {
      setModel("");
      setBrand("");
      setEditing(null);
   };

   const handleBrandDelete = (id: string) => {
      deleteModel({ variables: { id } });
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
                     Model Ekle
                  </Button>
               </DialogTrigger>
               <DialogContent aria-describedby={undefined} className="max-w-[350px]">
                  <DialogHeader>
                     <DialogTitle>{editing ? "Düzenle" : "Bir araç modeli ekle"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="brand" className="text-right">
                           Marka
                        </Label>
                        <Select defaultValue={brand} onValueChange={(value) => setBrand(value)}>
                           <SelectTrigger className="col-span-3" id="brand">
                              <SelectValue placeholder="Bir marka seçiniz" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectGroup>
                                 {brandData &&
                                    brandData.brands.map((brand: Brand) => (
                                       <SelectItem key={brand.id} value={brand.id}>
                                          {brand.name}
                                       </SelectItem>
                                    ))}
                              </SelectGroup>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="model" className="text-right">
                           Model
                        </Label>
                        <Input required id="model" value={model} onChange={(e) => setModel(e.target.value)} className="col-span-3" />
                        {modelInputError && <p className="col-span-4 text-red-500">{modelInputError}</p>}
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
                     <TableHead>Model</TableHead>
                     <TableHead>Marka</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data &&
                     data.models.map((model: Model) => (
                        <TableRow key={model.id}>
                           <TableCell>{model.name}</TableCell>
                           <TableCell>{model.brand.name}</TableCell>
                           <TableCell className="text-right">
                              <div className="flex justify-end">
                                 <div>
                                    <Button onClick={() => handleModelEdit(model)} className="ml-2" size={"icon"} variant={"outline"}>
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
                                             <AlertDialogTitle>Bu modeli silmek istediğinize emin misiniz?</AlertDialogTitle>
                                             <AlertDialogDescription>Bu işlem geri alınamaz yine de devam etmek istiyor musunuz?</AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                             <AlertDialogCancel>Hayır</AlertDialogCancel>
                                             <AlertDialogAction onClick={() => handleBrandDelete(model.id)}>Evet</AlertDialogAction>
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

export default Models;
