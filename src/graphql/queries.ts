import { gql } from "@apollo/client";

export const BRANDS_SUBSCRIPTIONS = gql`
   subscription onBrandsUpdated {
      brands {
         id
         name
      }
   }
`;

export const ADD_BRAND_MUTATION = gql`
   mutation AddBrand($id: String, $name: String) {
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
