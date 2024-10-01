import { useQuery } from "@tanstack/react-query";

import { getTokenAddress, getTokenDecimals } from "../adapters/ClientsAdapter.ts";

export default function useGetTokenDecimals() {
  return useQuery({
    queryKey: ["tokenDecimals"],
    queryFn: () => getTokenDecimals(getTokenAddress()!),
    refetchInterval: 60000,
  });
}
