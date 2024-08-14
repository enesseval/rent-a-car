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

export const BRANDS_COUNT_SUBS = gql`
   subscription getBrandsCount {
      brands {
         id
         name
         vehicles_aggregate(order_by: { brand: { vehicles_aggregate: { count: desc } } }, where: { avaliable: { _eq: true } }) {
            aggregate {
               count
            }
         }
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

export const MODELS_SUBSCRIPTION_BY_ID = gql`
   subscription modelSubscription($brand_id: String) {
      models(where: { brand_id: { _eq: $brand_id } }) {
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
   subscription getVehicles($where: vehicles_bool_exp) {
      vehicles(where: $where) {
         avaliable
         brand_id
         category_id
         daily_price
         description
         fuel
         gear
         id
         image
         model_id
         model_year
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
   subscription VehiclesByDateRange($from: date, $to: date, $brand_id: String, $model_id: String, $fuel: String, $gear: String, $price_range_min: Int, $price_range_max: Int) {
      vehicles(
         where: {
            _and: [
               { available_from: { _lte: $from } }
               { available_to: { _gte: $to } }
               { brand_id: { _eq: $brand_id, _is_null: false } }
               { model_id: { _eq: $model_id, _is_null: false } }
               { fuel: { _eq: $fuel, _is_null: false } }
               { gear: { _eq: $gear, _is_null: false } }
               { daily_price: { _gte: $price_range_min, _lte: $price_range_max } }
            ]
         }
      ) {
         id
         name
         brand {
            name
         }
         model {
            name
         }
         fuel
         gear
         daily_price
         model_year
         description
         image
         available_from
         available_to
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

export const UPDATE_VEHICLE_AVALIABLE_MUTATION = gql`
   mutation updateAvaliable($id: String!) {
      update_vehicles_by_pk(pk_columns: { id: $id }, _set: { avaliable: false }) {
         id
      }
   }
`;

export const UPDATE_VEHICLE_COMMENT_MUTATION = gql`
   mutation updateAvaliable($id: String!, $comment: String!) {
      update_vehicles_by_pk(pk_columns: { id: $id }, _set: { comment: $comment }) {
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

export const GET_VEHICLE_BY_ID = gql`
   query getVehicleById($id: String!) {
      vehicles(where: { id: { _eq: $id } }) {
         id
         brand {
            name
         }
         model {
            name
         }
         fuel
         gear
         daily_price
         image
      }
   }
`;

//RESERVATIONS
export const RESERVATIONS_COUNT = gql`
   subscription reservationCount {
      reservations_aggregate {
         aggregate {
            count
         }
      }
   }
`;

export const ADD_RESERVATION_MUTATION = gql`
   mutation addReservation(
      $id: String
      $vehicle_id: String
      $start_date: date
      $end_date: date
      $total_price: money
      $driver_name: String
      $driver_tcno: String
      $driver_mail: String
      $driver_phone: String
      $driver_birthday: String
      $payment_status: Boolean
   ) {
      insert_reservations_one(
         object: {
            id: $id
            vehicle_id: $vehicle_id
            start_date: $start_date
            end_date: $end_date
            total_price: $total_price
            driver_name: $driver_name
            driver_tcno: $driver_tcno
            driver_mail: $driver_mail
            driver_phone: $driver_phone
            driver_birthday: $driver_birthday
            payment_status: $payment_status
         }
      ) {
         id
      }
   }
`;

export const GET_RESERVATION_SUBSCRIPTION = gql`
   subscription getReservation($id: String) {
      reservations(where: { id: { _eq: $id } }) {
         id
         created_at
         driver_birthday
         driver_mail
         driver_name
         driver_phone
         driver_tcno
         end_date
         payment_status
         start_date
         total_price
         vehicle_id
         vehicle {
            brand {
               name
            }
            model {
               name
            }
         }
      }
   }
`;

export const UPDATE_RESERVATION_PAYMENT_STATUS = gql`
   mutation updatePaymentStatus($id: String!) {
      update_reservations_by_pk(pk_columns: { id: $id }, _set: { payment_status: true }) {
         id
      }
   }
`;
