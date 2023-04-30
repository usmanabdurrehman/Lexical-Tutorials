import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryObserver,
  useQuery,
} from "react-query";
import { ChakraProvider } from "@chakra-ui/react";
import axios from "axios";
import ReactQuerySuspense from "./Components/ReactQuerySuspense/ReactQuerySuspense";
import { ReactQueryDevtools } from "react-query/devtools";

const defaultQueryFn = async ({ queryKey }: any) => {
  const { data } = await axios.get(`http://localhost:7000${queryKey[0]}`);
  return data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 0,
      retry: 0,
      cacheTime: 0,
      queryFn: defaultQueryFn,
      suspense: true,
    },
  },
});

export default function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQuerySuspense />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}
