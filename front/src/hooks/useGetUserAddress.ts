import { useQuery } from "@tanstack/react-query";

import { getUserAddress } from "../adapters/ClientsAdapter.ts";

export default function useGetUserAddress() {
  return useQuery({ queryKey: ["userAddress"], queryFn: getUserAddress, refetchInterval: 1000 });
}
