import { useMutation } from "@tanstack/react-query";

import { getTokenAddress, transferToken } from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";
import toast from "react-hot-toast";
import TransactionToast from "../components/TransactionToast/TransactionToast.tsx";

interface MutationFnParams {
  to: string;
  amount: bigint;
}

export default function useTransferToken() {
  const tokenAddress = getTokenAddress();
  const { data: userAddress } = useGetUserAddress();

  return useMutation({
    mutationFn: ({ to, amount }: MutationFnParams) =>
      transferToken(tokenAddress!, userAddress!, to, amount),
    onSuccess: (hash) => {
      if (hash) toast.custom(TransactionToast({ message: "Transfer transaction sent. Transaction hash:", hash }));
    },
    onError: (error) => {
      toast.error("Transfer transaction failed");
      console.error("Transfer transaction failed", error);
    },
  });
}
