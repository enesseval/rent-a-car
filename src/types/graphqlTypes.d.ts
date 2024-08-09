import { Mode } from "fs";

export interface Brand {
   id: string;
   name: string;
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
   avaliable: boolean;
   description: string!;
   brand: Brand;
   model: Model;
   category: Category;
}
