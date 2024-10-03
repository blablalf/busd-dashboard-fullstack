import { useQuery } from "@tanstack/react-query";
import useGetActions from "./useGetActions";
import { getBlockTimestamp } from "../adapters/ClientsAdapter";

export interface DailyTransferType {
  date: string;
  value: string;
}

export function useGetDailyTransfers() {
  const { data: actions, isLoading: getActionsLoading } = useGetActions();

  const getDailyTransfers = async () => {
    const dailyTransfers = new Map<string, bigint>();
    for (const action of actions) {
      if (action.eventName === "Transfer") {
        const timestamp = await getBlockTimestamp(action.blockNumber);
        const date = new Date(Number(timestamp) * 1000);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1
        const day = String(date.getUTCDate()).padStart(2, "0"); // Ensure two digits

        // Format the date
        const formattedDate = `${year}-${month}-${day}`;

        if (dailyTransfers.has(formattedDate)) {
          const existingValue: bigint = BigInt(
            dailyTransfers.get(formattedDate)!
          );
          const newValue: bigint = existingValue + BigInt(action.value);
          dailyTransfers.set(formattedDate, newValue);
        } else {
          dailyTransfers.set(formattedDate, action.value);
        }
      }
    }
    const dailyTransfersArr: DailyTransferType[] = Array.from(
      dailyTransfers.entries()
    ).map(([date, value]) => ({
      date,
      value: value.toString(),
    }));

    return dailyTransfersArr;
  };

  return useQuery({
    queryKey: ["dailyTransfers"],
    queryFn: getDailyTransfers,
    refetchInterval: 300000, // 5 minutes
    enabled: !getActionsLoading,
  });
}
