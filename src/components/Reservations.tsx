import { GET_RESERVATIONS_SUBSCRIPTION } from "@/graphql/queries";
import { useSubscription } from "@apollo/client";
import React from "react";
import Loading from "./Loading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Reservation } from "@/types/graphqlTypes";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "./ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

function Reservations() {
   const { data, loading, error } = useSubscription(GET_RESERVATIONS_SUBSCRIPTION);

   console.log(data);

   if (loading) return <Loading />;

   return (
      <div className="w-11/12 max-w-[1100px] mx-auto">
         {!loading && !error && data && (
            <Table className="mt-10 w-full">
               <TableHeader>
                  <TableRow>
                     <TableHead className="text-center">Araç</TableHead>
                     <TableHead className="text-center">Rezervasyon başlangıç tarihi</TableHead>
                     <TableHead className="text-center">Rezervasyon bitiş tarihi</TableHead>
                     <TableHead className="text-center">Rezervasyon tarihi</TableHead>
                     <TableHead className="text-center">Tutar</TableHead>
                     <TableHead className="text-center">Ödeme durumu</TableHead>
                     <TableHead className="text-center">Rezervasyon durumu</TableHead>
                     <TableHead className="text-center">Sürücü Bilgileri</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data &&
                     data.reservations.map((reservation: Reservation) => (
                        <TableRow key={reservation.id}>
                           <TableCell className="text-center">
                              {reservation.vehicle.brand.name} {reservation.vehicle.model.name}
                           </TableCell>
                           <TableCell className="text-center">{format(reservation.start_date, "d MMMM u", { locale: tr })}</TableCell>
                           <TableCell className="text-center">{format(reservation.end_date, "d MMMM u", { locale: tr })}</TableCell>
                           <TableCell className="text-center">{format(new Date(reservation.created_at), "d MMMM u", { locale: tr })}</TableCell>
                           <TableCell className="text-center">{reservation.total_price}</TableCell>
                           <TableCell className="text-center">{reservation.payment_status === true ? "Ödendi" : "Ödeme bekliyor"}</TableCell>
                           <TableCell className="text-center">{reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}</TableCell>
                           <TableCell className="text-center">
                              <AlertDialog>
                                 <AlertDialogTrigger>
                                    <Button variant={"outline"}>Görüntüle</Button>
                                 </AlertDialogTrigger>
                                 <AlertDialogContent>
                                    <AlertDialogHeader>
                                       <AlertDialogTitle>{reservation.driver_name}</AlertDialogTitle>
                                       <AlertDialogDescription>
                                          {reservation.driver_mail} <br />
                                          {reservation.driver_phone} <br />
                                          {reservation.driver_tcno} <br />
                                          {format(new Date(reservation.driver_birthday), "d MMMM u", { locale: tr })} <br />
                                       </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                       <AlertDialogCancel>Kapat</AlertDialogCancel>
                                    </AlertDialogFooter>
                                 </AlertDialogContent>
                              </AlertDialog>
                           </TableCell>
                        </TableRow>
                     ))}
               </TableBody>
            </Table>
         )}
      </div>
   );
}

export default Reservations;
