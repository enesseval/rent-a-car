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
