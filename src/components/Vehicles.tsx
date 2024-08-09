import { nanoid } from "nanoid";
import React, { useState } from "react";
import { TiDelete } from "react-icons/ti";
import { MdModeEdit } from "react-icons/md";
import { useMutation, useQuery, useSubscription } from "@apollo/client";

import Loading from "./Loading";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Brand, Category, Model, Vehicle } from "@/types/graphqlTypes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ADD_VEHICLE_MUTATION, DELETE_VEHICLE, GET_BRANDS, GET_CATEGORİES, GET_MODELS, UPDATE_VEHICLE_MUTATION, VEHICLE_SUBSCRIPTION } from "@/graphql/queries";

const initialVehicleState: Vehicle = {
   id: "",
   brand_id: "",
   model_id: "",
   category_id: "",
   fuel: "",
   gear: "",
   model_year: "",
   plate: "",
   daily_price: 0,
   image: "",
   avaliable: true,
   description: "",
   brand: {
      id: "",
      name: "",
   },
   model: {
      id: "",
      name: "",
      brand: {
         id: "",
         name: "",
      },
   },
   category: {
      id: "",
      name: "",
   },
};

function Vehicles() {
   const [open, setOpen] = useState(false);
   const [brandId, setBrandId] = useState("");
   const [editing, setEditing] = useState<Vehicle | null>(null);
   const [errors, setErrors] = useState<{ [key: string]: string }>({});
   const [vehicle, setVehicle] = useState<Vehicle>(initialVehicleState);

   const { data, loading, error } = useSubscription(VEHICLE_SUBSCRIPTION);
   const { data: brandData, loading: brandLoading, error: brandError } = useQuery(GET_BRANDS);
   const { data: categoryData, loading: categoryLoading, error: categoryError } = useQuery(GET_CATEGORİES);
   const { data: modelData, loading: modelLoading, error: modelError } = useQuery(GET_MODELS, { variables: { brand_id: brandId } });
   const [addVehicle] = useMutation(ADD_VEHICLE_MUTATION, {
      onCompleted: () => {
         toast({
            title: "Araç başarıyla eklendi",
         });
         setVehicle(initialVehicleState);
         setOpen(false);
         setEditing(null);
      },
      onError: (error) => {
         toast({
            title: "Araç eklenirken bir hata oluştu",
            description: error.message,
            variant: "destructive",
         });
      },
   });
   const [updateVehicle] = useMutation(UPDATE_VEHICLE_MUTATION, {
      onCompleted: () => {
         toast({
            title: "Araç başarıyla güncellendi",
         });
         setVehicle(initialVehicleState);
         setOpen(false);
         setEditing(null);
      },
      onError: (error) => {
         toast({
            title: "Araç güncellenirken bir hata oluştu",
            description: error.message,
            variant: "destructive",
         });
      },
   });
   const [deleteVehicle] = useMutation(DELETE_VEHICLE, {
      onCompleted: () => {
         toast({
            title: "Araç başarıyla silindi",
         });
         setVehicle(initialVehicleState);
         setOpen(false);
         setEditing(null);
      },
      onError: (error) => {
         toast({
            title: "Araç silinirken bir hata oluştu",
            description: error.message,
            variant: "destructive",
         });
      },
   });

   var modelsLength;
   if (modelData) modelsLength = modelData.models.length;

   const handleSelectChange = (id: string, value: string) => {
      console.log(id, value);
      setVehicle((prevVehicle) => ({ ...prevVehicle, [id]: value }));
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { id, value } = e.target;
      setVehicle((prevVehicle) => ({ ...prevVehicle, [id]: value }));
   };

   const handleRadioChange = (value: string) => {
      setVehicle((prevVehicle) => ({ ...prevVehicle, avaliable: value === "true" }));
   };

   //blur ve focus fonksiyonları input içini boşaltmaya ve doldurmaya yarıyor çünkü 0 solda kalıp değeri bozuyor.
   const handleNumberFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value === "0") {
         setVehicle((prevVehicle) => ({ ...prevVehicle, [e.target.id]: "" }));
      }
   };

   const handleNumberBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value === "") {
         setVehicle((prevVehicle) => ({ ...prevVehicle, [e.target.id]: 0 }));
      }
   };

   const handleValidation = () => {
      let valid = true;
      let errors: { [key: string]: string } = {};

      if (!vehicle.brand_id) {
         errors.brand_id = "Marka seçimi zorunludur.";
         valid = false;
      }

      if (!vehicle.model_id) {
         errors.model_id = "Model seçimi zorunludur.";
         valid = false;
      }

      if (!vehicle.category_id) {
         errors.category_id = "Kategori seçimi zorunludur.";
         valid = false;
      }

      if (!vehicle.fuel) {
         errors.fuel = "Yakıt tipi seçimi zorunludur.";
         valid = false;
      }

      if (!vehicle.gear) {
         errors.gear = "Vites tipi seçimi zorunludur.";
         valid = false;
      }

      if (!vehicle.model_year) {
         errors.model_year = "Model yılı seçimi zorunludur.";
         valid = false;
      }

      if (!vehicle.plate) {
         errors.plate = "Plaka zorunludur.";
         valid = false;
      }

      if (Number(vehicle.daily_price) <= 0) {
         errors.daily_price = "Günlük fiyat 0'dan büyük olmalıdır.";
         valid = false;
      }

      setErrors(errors);
      return valid;
   };

   const handleSubmit = () => {
      if (handleValidation()) {
         if (editing) updateVehicle({ variables: vehicle });
         else {
            const newVehicle = {
               ...vehicle,
               id: nanoid(),
            };
            addVehicle({ variables: newVehicle });
         }
         setVehicle(initialVehicleState);
         setEditing(null);
         setOpen(false);
      }
   };

   const handleVehicleEdit = (vehicle: Vehicle) => {
      setBrandId(vehicle.brand.id);
      setVehicle({
         id: vehicle.id,
         brand_id: vehicle.brand.id,
         model_id: vehicle.model.id,
         category_id: vehicle.category.id,
         fuel: vehicle.fuel,
         gear: vehicle.gear,
         model_year: vehicle.model_year,
         plate: vehicle.plate,
         daily_price: vehicle.daily_price,
         image: vehicle.image,
         avaliable: vehicle.avaliable,
         description: vehicle.description,
         brand: vehicle.brand,
         model: vehicle.model,
         category: vehicle.category,
      });
      setEditing(vehicle);
      setOpen(true);
   };

   const handleVehicleDelete = (id: string) => {
      deleteVehicle({ variables: { id } });
   };

   const handleDialogClose = () => {
      setVehicle(initialVehicleState);
      setEditing(null);
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
                     Araç ekle
                  </Button>
               </DialogTrigger>
               <DialogContent aria-describedby={undefined} className="max-w-[500px]">
                  <DialogHeader>
                     <DialogTitle>{editing ? "Düzenle" : "Bir araç ekle"}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="brand" className="text-right">
                           Marka
                        </Label>
                        <Select
                           value={vehicle.brand_id}
                           onValueChange={(value) => {
                              setBrandId(value);
                              handleSelectChange("brand_id", value);
                           }}
                        >
                           <SelectTrigger className={cn("col-span-3", errors.brand_id && "border-red-500")} id="brand">
                              <SelectValue placeholder="Bir marka seçiniz" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectGroup>
                                 {brandData &&
                                    !brandLoading &&
                                    !brandError &&
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
                        <Select value={vehicle.model_id} onValueChange={(value) => handleSelectChange("model_id", value)} disabled={brandId === ""}>
                           <SelectTrigger className={cn("col-span-3", errors.model_id && "border-red-500")} id="model">
                              <SelectValue placeholder={brandId === "" ? "Önce bir marka seçiniz" : modelsLength === 0 ? "Bu markada henüz bir model eklenmemiş" : "Bir model seçiniz"} />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectGroup>
                                 {modelData &&
                                    !modelError &&
                                    !modelLoading &&
                                    modelData.models.map((model: Model) => (
                                       <SelectItem key={model.id} value={model.id}>
                                          {model.name}
                                       </SelectItem>
                                    ))}
                              </SelectGroup>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                           Kategori
                        </Label>
                        <Select value={vehicle.category_id} onValueChange={(value) => handleSelectChange("category_id", value)}>
                           <SelectTrigger className={cn("col-span-3", errors.category_id && "border-red-500")} id="category">
                              <SelectValue placeholder="Bir kategori seçiniz" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectGroup>
                                 {categoryData &&
                                    !categoryLoading &&
                                    !categoryError &&
                                    categoryData.categories.map((category: Category) => (
                                       <SelectItem key={category.id} value={category.id}>
                                          {category.name}
                                       </SelectItem>
                                    ))}
                              </SelectGroup>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fuel" className="text-right">
                           Yakıt
                        </Label>
                        <Select value={vehicle.fuel} onValueChange={(value) => handleSelectChange("fuel", value)}>
                           <SelectTrigger id="fuel" className={cn("col-span-3", errors.fuel && "border-red-500")}>
                              <SelectValue placeholder="Yakıt tipi seçiniz" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectGroup>
                                 <SelectItem value="benzin">Benzinli</SelectItem>
                                 <SelectItem value="dizel">Dizel</SelectItem>
                                 <SelectItem value="elektrikli">Elektrikli</SelectItem>
                                 <SelectItem value="hybrid">Hybrid</SelectItem>
                              </SelectGroup>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="gear" className="text-right">
                           Vites
                        </Label>
                        <Select value={vehicle.gear} onValueChange={(value) => handleSelectChange("gear", value)}>
                           <SelectTrigger id="gear" className={cn("col-span-3", errors.gear && "border-red-500")}>
                              <SelectValue placeholder="Vites tipi seçiniz" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectGroup>
                                 <SelectItem value="otomatik">Otomatik</SelectItem>
                                 <SelectItem value="manuel">Manuel</SelectItem>
                              </SelectGroup>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="model_year" className="text-right">
                           Model Yılı
                        </Label>
                        <Select onValueChange={(value) => handleSelectChange("model_year", value)}>
                           <SelectTrigger id="model_year" className={cn("col-span-3", errors.model_year && "border-red-500")}>
                              <SelectValue placeholder="Model yılı seçiniz" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectGroup>
                                 <SelectItem value="2024">2024</SelectItem>
                                 <SelectItem value="2023">2023</SelectItem>
                                 <SelectItem value="2022">2022</SelectItem>
                                 <SelectItem value="2021">2021</SelectItem>
                                 <SelectItem value="2020">2020</SelectItem>
                              </SelectGroup>
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="plate" className="text-right">
                           Plaka
                        </Label>
                        <Input onChange={handleInputChange} value={vehicle.plate} id="plate" className={cn("col-span-3", errors.plate && "border-red-500")} />
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="daily_price" className="text-right">
                           Günlük Fiyat
                        </Label>
                        <Input
                           onChange={handleInputChange}
                           value={vehicle.daily_price.toString()}
                           onFocus={handleNumberFocus}
                           onBlur={handleNumberBlur}
                           id="daily_price"
                           className={cn("[&::-webkit-inner-spin-button]:appearance-none col-span-3", errors.plate && "border-red-500")}
                           type="number"
                        />
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">
                           Resim
                        </Label>
                        <Input onChange={handleInputChange} value={vehicle.image} id="image" className={cn("col-span-3", errors.plate && "border-red-500")} />
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="plate" className="text-right">
                           Müsaitlik
                        </Label>
                        <RadioGroup className={cn("flex flex-row col-span-3", errors.plate && "text-red-500")} value={vehicle.avaliable.toString()} onValueChange={handleRadioChange}>
                           <div className="flex space-x-2">
                              <RadioGroupItem value="true" id="true" />
                              <Label htmlFor="true">Müsait</Label>
                           </div>
                           <div className="flex space-x-2">
                              <RadioGroupItem value="false" id="false" />
                              <Label htmlFor="false">Müsait değil</Label>
                           </div>
                        </RadioGroup>
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                           Açıklama
                        </Label>
                        <Textarea onChange={handleInputChange} value={vehicle.description} id="description" className={cn("col-span-3", errors.plate && "border-red-500")} />
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
            <Table className="mt-20 max-w-[900px] mx-auto">
               <TableHeader>
                  <TableRow>
                     <TableHead>Marka</TableHead>
                     <TableHead>Model</TableHead>
                     <TableHead>Kategori</TableHead>
                     <TableHead>Yakıt</TableHead>
                     <TableHead>Vites</TableHead>
                     <TableHead>Model Yılı</TableHead>
                     <TableHead>Günlük Fiyat</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data &&
                     data.vehicles.map((vehicle: Vehicle) => (
                        <TableRow key={vehicle.id}>
                           <TableCell>{vehicle.brand.name}</TableCell>
                           <TableCell>{vehicle.model.name}</TableCell>
                           <TableCell>{vehicle.category.name}</TableCell>
                           <TableCell>{vehicle.fuel}</TableCell>
                           <TableCell>{vehicle.gear}</TableCell>
                           <TableCell>{vehicle.model_year}</TableCell>
                           <TableCell>{vehicle.daily_price.toString()}₺</TableCell>
                           <TableCell className="text-right">
                              <div className="flex justify-end">
                                 <div>
                                    <Button onClick={() => handleVehicleEdit(vehicle)} className="ml-2" size={"icon"} variant={"outline"}>
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
                                             <AlertDialogTitle>Bu aracı silmek istediğinize emin misiniz?</AlertDialogTitle>
                                             <AlertDialogDescription>Bu işlem geri alınamaz yine de devam etmek istiyor musunuz?</AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                             <AlertDialogCancel>Hayır</AlertDialogCancel>
                                             <AlertDialogAction onClick={() => handleVehicleDelete(vehicle.id)}>Evet</AlertDialogAction>
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

export default Vehicles;
