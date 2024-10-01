import { useQuery } from "@tanstack/react-query";

import {
  getTokenAddress,
  getTokenBalance,
} from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";

export default function useGetTokenBalance() {
  const { data: userAddress } = useGetUserAddress();

  const _getTokenBalance = async () => {
    const tokenBalance = await getTokenBalance(getTokenAddress()!, userAddress!);
    return tokenBalance ? tokenBalance.toString() : "0";
  };

  return useQuery({
    queryKey: ["tokenBalance", userAddress],
    queryFn: _getTokenBalance,
    enabled: userAddress ? true : false,
    refetchInterval: 60000,
  });
}
