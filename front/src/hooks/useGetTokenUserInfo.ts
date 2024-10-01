import { useQuery } from "@tanstack/react-query";

import { getTokenAddress, getTokenUserInfo } from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";

export default function useGetTokenUserInfo() {
  const { data: userAddress } = useGetUserAddress();

  const getTotalSupply = async () => {
    const info = await getTokenUserInfo(getTokenAddress()!, userAddress!);
    if (info) {
      const balance = (info.balance as bigint).toString();
      const totalSupply = (info.totalSupply as bigint).toString();
      const decimals = info.decimals;
      const name = info.name;
      return { balance, totalSupply, decimals, name };
    } else {
      const balance = "0";
      const totalSupply = "0";
      const decimals = 0;
      const name = "";
      return { balance, totalSupply, decimals, name };
    }
  };

  return useQuery({
    queryKey: ["totalSupply"],
    queryFn: getTotalSupply,
    refetchInterval: 60000,
  });
}
