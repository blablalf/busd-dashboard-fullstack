import { useQuery } from "@tanstack/react-query";
import useGetActions from "./useGetActions";
import useGetUserAddress from "./useGetUserAddress";
import { address0, getBlockTimestamp } from "../adapters/ClientsAdapter";

interface Action {
  id: number;
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

export default function useGetLastActionsApi(
  anyUser: boolean,
  actionsAmount: number
) {
  const { data: actions, isLoading: getActionsLoading } = useGetActions();
  const { data: userAddress } = useGetUserAddress();

  const checkIfUserAction = (action: Action) => {
    if (
      (action.eventName == "Approval" && action.owner == userAddress) ||
      (action.eventName == "Transfer" && action.from == userAddress) ||
      (action.eventName == "Transfer" &&
        action.from == address0 &&
        action.to == userAddress)
    ) {
      return true;
    }
    return false;
  };

  const getLastActionEvents = async (
    anyUser: boolean,
    actionsAmount: number
  ) => {
    let lastActionCounter = 0;
    const lastActions: Action[] = [];
    const timestamps: bigint[] = [];
    if (actions) {
      for (
        let actionIndex = 0;
        lastActionCounter < actionsAmount && actions.length - 1 > actionIndex;
        actionIndex++
      ) {
        if (
          !anyUser &&
          checkIfUserAction(actions[actions.length - 1 - actionIndex])
        ) {
          lastActions[lastActionCounter] =
            actions[actions.length - 1 - actionIndex];
          lastActionCounter++;
        } else if (anyUser) {
          lastActions[lastActionCounter] =
            actions[actions.length - 1 - actionIndex];
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
    enabled: !getActionsLoading,
  });
}
