import { useMutation } from "@tanstack/react-query";

import { mintToken, getTokenAddress } from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";
import toast from "react-hot-toast";
import TransactionToast from "../components/TransactionToast/TransactionToast.tsx";

export default function useMintToken() {
  const tokenAddress = getTokenAddress();
  const { data: userAddress } = useGetUserAddress();
  return useMutation({
    mutationFn: (amount: bigint) => mintToken(tokenAddress!, userAddress!, amount),
    onSuccess: (hash) => {
      if (hash) toast.custom(TransactionToast({ message: "Mint transaction sent. Transaction hash:", hash }));
    },
    onError: (error) => {
      toast.error("Mint transaction failed");
      console.error("Mint transaction failed", error);
    },
  });
}
