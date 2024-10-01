import { useMutation } from "@tanstack/react-query";

import {
  getAllowance,
  getTokenAddress,
  transferFromToken,
} from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";
import toast from "react-hot-toast";
import TransactionToast from "../components/TransactionToast/TransactionToast.tsx";
import { formatUnits } from "viem";
import useGetTokenDecimals from "./useGetTokenDecimals.ts";

interface MutationFnParams {
  sender: string;
  recipient: string;
  amount: bigint;
}

export default function useTransferFromToken() {
  const tokenAddress = getTokenAddress();
  const { data: userAddress } = useGetUserAddress();
  const { data: decimals } = useGetTokenDecimals();

  const transferFrom = async (tokenAddress: string, spender: string, ownerAddress: string, recipient: string, amount: bigint) => {
    const allowance: bigint = await getAllowance(tokenAddress, ownerAddress, spender);
    if (allowance >= amount) {
      return await transferFromToken(tokenAddress, userAddress!, ownerAddress, recipient, amount);
    } else {
      const parsedAllowance = formatUnits(BigInt(allowance!), decimals! as number);
      const error = new Error("You do not have enough allowance to do this. Current allowance: " + parsedAllowance);
      error.name = "insufficient_allowance";
      throw error;
    }
  };

  return useMutation({
    mutationFn: ({ sender, recipient, amount }: MutationFnParams) =>
      transferFrom(tokenAddress!, userAddress!, sender, recipient, amount),
    onSuccess: (hash) => {
      if (hash) toast.custom(TransactionToast({ message: "TransferFrom transaction sent. Transaction hash:", hash }));
    },
    onError: (error) => {
      if (error.name === "insufficient_allowance") {
        toast.error(error.message);
      } else {
        toast.error("TransferFrom transaction failed");
        console.error("TransferFrom transaction failed", error);
      }
    },
  });
}
