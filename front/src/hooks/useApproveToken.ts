import { useMutation } from "@tanstack/react-query";

import { approveToken, getTokenAddress } from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";
import toast from "react-hot-toast";
import TransactionToast from "../components/TransactionToast/TransactionToast.tsx";

interface MutationFnParams {
  spender: string;
  amount: bigint;
}

export default function useApproveToken() {
  const tokenAddress = getTokenAddress();
  const { data: ownerAddress } = useGetUserAddress();

  return useMutation({
    mutationFn: ({ spender, amount }: MutationFnParams) =>
      approveToken(tokenAddress!, ownerAddress!, spender, amount),
    onSuccess: (hash) => {
      if (hash) toast.custom(TransactionToast({ message: "Approve transaction sent. Transaction hash:", hash }));
    },
    onError: (error) => {
      toast.error("Approve transaction failed");
      console.error("Approve transaction failed", error);
    },
  });
}
