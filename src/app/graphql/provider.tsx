"use client";
import { auth } from "@/services/firebaseConfig";
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { ReactNode } from "react";

export const Provider = ({ children }: { children: ReactNode }) => {
   const httpLink = new HttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT,
   });

   const wsLink = new GraphQLWsLink(
      createClient({
         url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_WS_ENDPOINT!,
         connectionParams: async () => {
            const token = await auth.currentUser?.getIdToken();
            return {
               headers: {
                  "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET!,
                  Authorization: `Bearer ${token}`,
               },
            };
         },
      })
   );

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
   //typePolicies içindeki tanımlama Subscription çalıştığında verdiği uyarı için yapılmıştır.
   //Apollo gelen markaların nasıl birleştirileceğini bilmediğinden buna ihtiyaç duyuyor.
   const client = new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache({
         typePolicies: {
            Subscription: {
               fields: {
                  brands: {
                     merge(existing = [], incomming: any[]) {
                        return [...existing, ...incomming];
                     },
                  },
               },
            },
         },
      }),
   });
   return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
