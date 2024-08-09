import { gql } from "@apollo/client";

//BRANDS
export const GET_BRANDS = gql`
   query getBrands {
      brands {
         id
         name
      }
   }
`;

export const BRANDS_SUBSCRIPTIONS = gql`
   subscription onBrandsUpdated {
      brands {
         id
         name
      }
   }
`;

export const ADD_BRAND_MUTATION = gql`
   mutation addBrand($id: String, $name: String) {
      insert_brands_one(object: { id: $id, name: $name }) {
         id
      }
   }
`;

export const UPDATE_BRAND_MUTATION = gql`
   mutation updateBrand($id: String!, $name: String!) {
      update_brands_by_pk(pk_columns: { id: $id }, _set: { name: $name }) {
         id
      }
   }
`;

export const DELETE_BRAND = gql`
   mutation deleteBrand($id: String!) {
      delete_brands_by_pk(id: $id) {
         id
      }
   }
`;

// MODELS
export const GET_MODELS = gql`
   query getModels($brand_id: String) {
      models(where: { brand_id: { _eq: $brand_id } }) {
         id
         name
      }
   }
`;

export const MODELS_SUBSCRIPTION = gql`
   subscription modelSubscription {
      models {
         id
         name
         brand {
            id
            name
         }
      }
   }
`;

export const ADD_MODEL_MUTATION = gql`
   mutation addModel($id: String, $name: String, $brand_id: String) {
      insert_models_one(object: { id: $id, name: $name, brand_id: $brand_id }) {
         id
      }
   }
`;

export const UPDATE_MODEL_MUTATION = gql`
   mutation updateModel($id: String!, $name: String!, $brand_id: String!) {
      update_models_by_pk(pk_columns: { id: $id }, _set: { name: $name, brand_id: $brand_id }) {
         id
      }
   }
`;

export const DELETE_MODEL = gql`
   mutation deleteModel($id: String!) {
      delete_models_by_pk(id: $id) {
         id
      }
   }
`;

// CATEGORIES
export const GET_CATEGORİES = gql`
   query getCategories {
      categories {
         id
         name
      }
   }
`;

export const ADD_CATEGORY_MUTATION = gql`
   mutation addCategory($id: String, $name: String) {
      insert_categories_one(object: { id: $id, name: $name }) {
         id
      }
   }
`;

export const CATEGORY_SUBSCRIPTION = gql`
   subscription getCategories {
      categories {
         id
         name
      }
   }
`;

export const UPDATE_CATEGORY_MUTATION = gql`
   mutation updateCategory($id: String!, $name: String!) {
      update_categories_by_pk(pk_columns: { id: $id }, _set: { name: $name }) {
         id
      }
   }
`;

export const DELETE_CATEGORY = gql`
   mutation deleteCategory($id: String!) {
      delete_categories_by_pk(id: $id) {
         id
      }
   }
`;

//VEHICLES
export const ADD_VEHICLE_MUTATION = gql`
   mutation addVehicle(
      $id: String
      $brand_id: String
      $model_id: String
      $category_id: String
      $fuel: String
      $gear: String
      $model_year: String
      $plate: String
      $daily_price: String
      $image: String
      $avaliable: Boolean
      $description: String!
   ) {
      insert_vehicles_one(
         object: {
            id: $id
            brand_id: $brand_id
            model_id: $model_id
            category_id: $category_id
            fuel: $fuel
            gear: $gear
            model_year: $model_year
            plate: $plate
            daily_price: $daily_price
            image: $image
            avaliable: $avaliable
            description: $description
         }
      ) {
         id
      }
   }
`;

export const VEHICLE_SUBSCRIPTION = gql`
   subscription getVehicles {
      vehicles {
         id
         fuel
         gear
         model_year
         daily_price
         description
         avaliable
         image
         plate
         brand {
            id
            name
         }
         model {
            id
            name
         }
         category {
            id
            name
         }
      }
   }
`;

export const VEHICLES_BY_DATE_RANGE = gql`
   subscription getVehiclesByDateRange($from: String!, $to: String!) {
      vehicles(where: { _or: [{ reservations: { _not: { end_date: { _gte: $from } } } }, { reservations: { _not: { start_date: { _lte: $to } } } }] }) {
         id
         fuel
         gear
         model_year
         daily_price
         description
         avaliable
         image
         plate
         brand {
            id
            name
         }
         model {
            id
            name
         }
         category {
            id
            name
         }
      }
   }
`;

export const UPDATE_VEHICLE_MUTATION = gql`
   mutation updateVehicle(
      $id: String!
      $brand_id: String!
      $model_id: String!
      $category_id: String!
      $fuel: String!
      $gear: String!
      $model_year: String!
      $plate: String!
      $daily_price: String!
      $image: String!
      $avaliable: Boolean!
      $description: String!
   ) {
      update_vehicles_by_pk(
         pk_columns: { id: $id }
         _set: {
            brand_id: $brand_id
            model_id: $model_id
            category_id: $category_id
            fuel: $fuel
            gear: $gear
            model_year: $model_year
            plate: $plate
            daily_price: $daily_price
            image: $image
            avaliable: $avaliable
            description: $description
         }
      ) {
         id
      }
   }
`;

export const DELETE_VEHICLE = gql`
   mutation deleteVehicle($id: String!) {
      delete_vehicles_by_pk(id: $id) {
         id
      }
   }
`;

//RESERVAATIONS
export const RESERVATIONS_COUNT = gql`
   subscription reservationCount {
      reservations_aggregate {
         aggregate {
            count
         }
      }
   }
`;
