import { useQuery } from "@tanstack/react-query";

import { getAllowance, getTokenAddress } from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";
import useGetActions from "./useGetActions.ts";

export default function useGetApprovalsApi() {
  const { data: actions, isLoading: getActionsLoading } = useGetActions();
  const { data: userAddress } = useGetUserAddress();
  const tokenAddress = getTokenAddress();

  const getApprovals = async () => {
    const uniqueAddresses = new Set();
    const approvals = new Map();
    for (const action of actions) {
      if (action.eventName === "Approval" && action.owner === userAddress && action.spender === userAddress) {
        console.log("action", action);
      }
      if (
        action.eventName === "Approval" &&
        action.spender &&
        action.owner === userAddress &&
        !uniqueAddresses.has(action.spender)
      ) {
        uniqueAddresses.add(action.spender);
        const approval = await getAllowance(
          tokenAddress!,
          action.owner,
          action.spender
        );
        approvals.set(action.spender, approval);
      }
    }
    return approvals;
  };

  return useQuery({
    queryKey: ["approvalsApi"],
    queryFn: getApprovals,
    enabled: !getActionsLoading && userAddress && tokenAddress ? true : false,
    refetchInterval: 3000000, // 5 minutes
  });
}
