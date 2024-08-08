import { Category } from "@/types/graphqlTypes";
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useMutation, useSubscription } from "@apollo/client";
import { ADD_CATEGORY_MUTATION, CATEGORY_SUBSCRIPTION, DELETE_CATEGORY, UPDATE_CATEGORY_MUTATION } from "@/graphql/queries";
import { nanoid } from "nanoid";
import { useToast } from "./ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { TiDelete } from "react-icons/ti";
import { MdModeEdit } from "react-icons/md";
import Loading from "./Loading";
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

function Categories() {
   const { toast } = useToast();
   const [open, setOpen] = useState(false);
   const [category, setCategory] = useState("");
   const [editing, setEditing] = useState<Category | null>(null);
   const [categorySubmitError, setCategorySubmitError] = useState("");

   const { data, loading, error } = useSubscription(CATEGORY_SUBSCRIPTION);
   const [addCategory] = useMutation(ADD_CATEGORY_MUTATION, {
      onCompleted: () => {
         toast({
            title: "Kategori başarıyla eklendi",
         });
         setCategory("");
         setOpen(false);
         setEditing(null);
      },
      onError: (error) => {
         toast({
            title: "Kategori eklenirken bir hata oluştu",
            description: error.message,
            variant: "destructive",
         });
      },
   });
   const [updateCategory] = useMutation(UPDATE_CATEGORY_MUTATION, {
      onCompleted: () => {
         toast({
            title: "Kategori başarıyla güncellendi",
         });
         setCategory("");
         setOpen(false);
         setEditing(null);
      },
      onError: (error) => {
         toast({
            title: "Kategori güncellenirken bir hata oluştu",
            description: error.message,
            variant: "destructive",
         });
      },
   });
   const [deleteCategory] = useMutation(DELETE_CATEGORY, {
      onCompleted: () => {
         toast({
            title: "Kategori başarıyla silindi",
         });
         setCategory("");
         setOpen(false);
         setEditing(null);
      },
      onError: (error) => {
         toast({
            title: "Kategori silinirken bir hata oluştu",
            description: error.message,
            variant: "destructive",
         });
      },
   });

   const handleSubmit = () => {
      if (category.trim() === "") {
         setCategorySubmitError("Bu alan zorunludur.");
         return;
      }

      if (editing) updateCategory({ variables: { id: editing.id, name: category } });
      else addCategory({ variables: { id: nanoid(), name: category } });
   };

   const handleCategoryEdit = (category: Category) => {
      setCategory(category.name);
      setEditing(category);
      setOpen(true);
   };

   const handleDialogClose = () => {
      setCategory("");
      setEditing(null);
   };

   const handleDeleteCategory = (id: string) => {
      deleteCategory({ variables: { id } });
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
                     Kategori Ekle
                  </Button>
               </DialogTrigger>
               <DialogContent aria-describedby={undefined} className="max-w-[350px]">
                  <DialogHeader>
                     <DialogTitle>{editing ? "Düzenle" : "Bir araç markası ekle"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="brand" className="text-right">
                           Kategori
                        </Label>
                        <Input id="brand" value={category} onChange={(e) => setCategory(e.target.value)} className="col-span-3" />
                        {categorySubmitError && <p className="col-span-4 text-red-500">{categorySubmitError}</p>}
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
                     <TableHead>Kategori</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data &&
                     data.categories.map((category: Category) => (
                        <TableRow key={category.id}>
                           <TableCell>{category.name}</TableCell>
                           <TableCell className="text-right">
                              <div className="flex justify-end">
                                 <div>
                                    <Button onClick={() => handleCategoryEdit(category)} className="ml-2" size={"icon"} variant={"outline"}>
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
                                             <AlertDialogTitle>Bu kategoriyi silmek istediğinize emin misiniz?</AlertDialogTitle>
                                             <AlertDialogDescription>Bu işlem geri alınamaz yine de devam etmek istiyor musunuz?</AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                             <AlertDialogCancel>Hayır</AlertDialogCancel>
                                             <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>Evet</AlertDialogAction>
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

export default Categories;
