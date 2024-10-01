import { useQuery } from "@tanstack/react-query";

import { getTokenAddress, getTokenTotalSupply } from "../adapters/ClientsAdapter.ts";

export default function useGetTokenTotalSupply() {
  const tokenAddress = getTokenAddress();

  const getTotalSupply = async () => {
    const totalSupply = await getTokenTotalSupply(tokenAddress!);
    return totalSupply ? totalSupply.toString() : "0";
  };

  return useQuery({
    queryKey: ["totalSupply"],
    queryFn: getTotalSupply,
    refetchInterval: 60000,
  });
}
