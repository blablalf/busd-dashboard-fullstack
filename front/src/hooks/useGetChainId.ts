import { useQuery } from "@tanstack/react-query";

import { getChainId } from "../adapters/ClientsAdapter.ts";

export default function useGetChainId() {
  return useQuery({
    queryKey: ["chainId"],
    queryFn: getChainId,
    refetchInterval: 1000
  });
}
