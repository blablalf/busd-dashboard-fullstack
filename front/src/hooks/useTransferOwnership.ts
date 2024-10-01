import { useMutation } from "@tanstack/react-query";

import {
  getTokenAddress,
  transferOwnership,
} from "../adapters/ClientsAdapter.ts";
import toast from "react-hot-toast";
import useGetUserAddress from "./useGetUserAddress.ts";
import TransactionToast from "../components/TransactionToast/TransactionToast.tsx";

export default function useTransferOwnership() {
  const tokenAddress = getTokenAddress();
  const { data: userAddress } = useGetUserAddress();

  return useMutation({
    mutationFn: (newOwner: string) =>
      transferOwnership(tokenAddress!, userAddress!, newOwner),
    onSuccess: (hash) => {
      if (hash) toast.custom(TransactionToast({ message: "TransferOwnership transaction sent. Transaction hash:", hash }));
    },
    onError: (error) => {
      toast.error("TransferOwnership transaction failed");
      console.error("TransferOwnership transaction failed", error);
    },
  });
}
