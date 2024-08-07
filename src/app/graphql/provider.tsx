"use client";
import { auth } from "@/services/firebaseConfig";
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { ReactNode } from "react";

export const Provider = ({ children }: { children: ReactNode }) => {
   const httpLink = new HttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT,
   });

   const wsLink = new WebSocketLink({
      uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT!,
      options: {
         reconnect: true,
         connectionParams: async () => {
            const token = await auth.currentUser?.getIdToken();
            return {
               headers: {
                  "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
                  Authorization: `Bearer ${token}`,
               },
            };
         },
      },
   });

   const authLink = setContext(async (_, { headers }) => {
      const token = await auth.currentUser?.getIdToken();
      return {
         headers: {
            ...headers,
            "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
            Authorization: `Bearer ${token}`,
         },
      };
   });

   const splitLink = split(
      ({ query }) => {
         const defination = getMainDefinition(query);
         return defination.kind === "OperationDefinition" && defination.operation === "subscription";
      },
      wsLink,
      authLink.concat(httpLink)
   );

   const client = new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
   });
   return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
