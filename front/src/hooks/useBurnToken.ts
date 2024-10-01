import { useMutation } from "@tanstack/react-query";

import { burnToken, getTokenAddress } from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";
import toast from "react-hot-toast";
import TransactionToast from "../components/TransactionToast/TransactionToast.tsx";

export default function useBurnToken() {
  const tokenAddress = getTokenAddress();
  const { data: userAddress } = useGetUserAddress();
  return useMutation({
    mutationFn: (amount: bigint) => burnToken(tokenAddress!, userAddress!, amount),
    onSuccess: (hash) => {
      if (hash) toast.custom(TransactionToast({ message: "Burn transaction sent. Transaction hash:", hash }));
    },
    onError: (error) => {
      toast.error("Burn transaction failed");
      console.error("Burn transaction failed", error);
    },
  });
}
