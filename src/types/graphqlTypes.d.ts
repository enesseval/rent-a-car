export interface Brand {
   id: string;
   name: string;
}

export interface Model {
   id: string;
   name: string;
   brand: Brand;
}
