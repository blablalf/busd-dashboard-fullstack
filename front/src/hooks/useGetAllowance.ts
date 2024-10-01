import { useQuery } from "@tanstack/react-query";

import { getAllowance, getTokenAddress } from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";

export default function useGetAllowance(spender: string) {
  const { data: userAddress } = useGetUserAddress();

  const getTokenAllowance = async () => {
    const allowance = await getAllowance(
      getTokenAddress()!,
      userAddress!,
      spender
    );
    return allowance;
  };

  return useQuery({
    queryKey: ["allowance", userAddress, spender],
    queryFn: getTokenAllowance,
    enabled: userAddress && spender ? true : false,
    refetchInterval: 60000,
    initialData: BigInt(0),
  });
}
