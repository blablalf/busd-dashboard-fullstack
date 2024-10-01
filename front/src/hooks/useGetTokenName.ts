import { useQuery } from "@tanstack/react-query";

import { getTokenAddress, getTokenName } from "../adapters/ClientsAdapter.ts";

export default function useGetTokenName() {
  return useQuery({
    queryKey: ["tokenName"],
    queryFn: () => getTokenName(getTokenAddress()!),
    refetchInterval: 60000,
  });
}
