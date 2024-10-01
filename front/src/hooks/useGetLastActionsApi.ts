import { useQuery } from "@tanstack/react-query";
import useGetActions from "./useGetActions";
import useGetUserAddress from "./useGetUserAddress";
import { getBlockTimestamp } from "../adapters/ClientsAdapter";

interface Action {
  blockNumber: string;
  eventName: string;
  timestamp: bigint;
  txHash: string;
  from?: string;
  to?: string;
  owner?: string;
  spender?: string;
  value: string;
}

export default function useGetLastActionsApi(anyUser: boolean, actionsAmount: number) {
  const { data: actions } = useGetActions();
  const userAddress = useGetUserAddress();

  const getLastActionEvents = async (anyUser: boolean, actionsAmount: number) => {
    let lastActionCounter = 0;
    const lastActions: [Action] = actions;
    const timestamps: bigint[] = [];
    if (actions) {
      for (let actionIndex = 0; lastActionCounter < actionsAmount && actions.length > actionIndex; actionIndex++) {
        if (!anyUser && actions[actions.length - actionIndex].from == userAddress || actions[actions.length - actionIndex].owner == userAddress) {
            lastActions[actionIndex] = actions[actions.length - actionIndex];
            lastActionCounter++;
        } else if (anyUser) {
            lastActions[actionIndex] = actions[actions.length - actionIndex];
            lastActionCounter++;
        }
      }
      for (const lastAction of lastActions) {
        timestamps.push(
          (await getBlockTimestamp(BigInt(lastAction.blockNumber))) as bigint
        );
      }
      return lastActions!.map((lastAction, index) => ({
        ...lastAction,
        timestamp: timestamps[index],
      }));
    }
    return [];
  };

  return useQuery({
    queryKey: [anyUser ? "lastAnyUserActions" : "lastUserActions", userAddress],
    queryFn: () => getLastActionEvents(anyUser, actionsAmount),
    refetchInterval: 60000,
    structuralSharing: false,
  });
}
