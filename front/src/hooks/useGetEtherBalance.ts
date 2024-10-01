import { useQuery } from "@tanstack/react-query";

import { getEtherBalance } from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";

export default function useGetEtherBalance() {
  const { data: userAddress } = useGetUserAddress();

  const _getEtherBalance = async () => {
    const etherBalance = await getEtherBalance(userAddress!);
    return etherBalance!.toString();
  }

  return useQuery({
    queryKey: ["etherBalance", userAddress],
    queryFn: _getEtherBalance,
    enabled: userAddress ? true : false,
    refetchInterval: 5000,
  });
}
