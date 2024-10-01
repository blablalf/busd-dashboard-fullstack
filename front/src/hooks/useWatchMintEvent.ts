import { useEffect } from "react";
import { getTokenAddress, watchMintEvent } from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";
import { useQueryClient } from "@tanstack/react-query";

export default function useWatchMintEvent(amount: bigint) {
  const { data: userAddress } = useGetUserAddress();
  const queryClient = useQueryClient();

  useEffect(() => {
    const refetchBalance = () => {
      queryClient.invalidateQueries({ queryKey: ["tokenBalance", userAddress] });
    };

    const unlisten = watchMintEvent(
      getTokenAddress()!,
      userAddress!,
      amount,
      refetchBalance
    );

    return () => {
      unlisten!();
    };
  }, [queryClient, userAddress, amount]);
}
