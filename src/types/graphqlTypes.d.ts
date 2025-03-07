import { Mode } from "fs";

export interface Brand {
   id: string;
   name: string;
}

interface aggregate {
   aggregate: {
      count: number;
   };
}

export interface BrandCount {
   id: string;
   name: string;
   vehicles_aggregate: aggregate;
}

export interface Model {
   id: string;
   name: string;
   brand: Brand;
}

export interface Category {
   id: string;
   name: string;
}

export interface Vehicle {
   id: string;
   brand_id: string;
   model_id: string;
   category_id: string;
   fuel: string;
   gear: string;
   model_year: string;
   plate: string;
   daily_price: Number;
   image: string;
   available: boolean;
   description: string!;
   brand: Brand;
   model: Model;
   category: Category;
}

export interface Filters {
   brand_id: string | {};
   model_id: string | {};
   fuel: string | {};
   gear: string | {};
   price_range_min: string | {};
   price_range_max: string | {};
}

export interface VehiclesLeftSideBarProps {
   onFilter: (filters: Filters) => void;
}

export interface Reservation {
   id: string;
   vehicle_id: string;
   start_date: string;
   end_date: string;
   created_at: string;
   total_price: string;
   payment_status: boolean;
   driver_name: string;
   driver_mail: string;
   driver_phone: string;
   driver_tcno: string;
   driver_birthday: string;
   status: string;
   vehicle: Vehicle;
}
