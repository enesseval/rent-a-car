import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { nanoid } from "nanoid";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Brand } from "@/types/graphqlTypes";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";

const GET_BRANDS = gql`
   query getBrands {
      brands {
         id
         name
      }
   }
`;

const ADD_BRAND_MUTATION = gql`
   mutation AddBrand($id: String, $name: String) {
      insert_brands_one(object: { id: $id, name: $name }) {
         id
      }
   }
`;

function Brands() {
   const [brand, setBrand] = useState("");
   const [open, setOpen] = useState(false);
   const { data, loading, error } = useQuery(GET_BRANDS, { pollInterval: 500 });
   const [addBrand, { data: addBrandData, loading: addBrandLoading, error: addBrandError }] = useMutation(ADD_BRAND_MUTATION);

   if (data) console.log(data.brands);

   const handleSubmit = () => {
      addBrand({ variables: { id: nanoid(), name: brand } });
      if (!addBrandLoading && !addBrandError) {
         setBrand("");
         setOpen(false);
      }
   };

   return (
      <div className="w-full relative">
         <div className="absolute top-5 right-5">
            <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                  <Button variant={"outline"}>Marka Ekle</Button>
               </DialogTrigger>
               <DialogContent aria-describedby={undefined} className="max-w-[350px]">
                  <DialogHeader>
                     <DialogTitle>Bir araç markası ekle</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="brand" className="text-right">
                           Marka
                        </Label>
                        <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="col-span-3" />
                     </div>
                  </div>
                  <DialogFooter className="w-full flex flex-col items-end">
                     <Button onClick={() => handleSubmit()} className="max-w-[100px]" type="submit">
                        Ekle
                     </Button>
                  </DialogFooter>
               </DialogContent>
            </Dialog>
         </div>

         <Table className="mt-14">
            <TableHeader>
               <TableRow>
                  <TableHead>asdsa</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>{data && data.brands.map((brand: Brand) => <TableRow key={brand.id}>{brand.name}</TableRow>)}</TableBody>
         </Table>
      </div>
   );
}

export default Brands;
