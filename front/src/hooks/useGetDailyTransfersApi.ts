import { useQuery } from "@tanstack/react-query";
import { getDailyTransfers } from "../adapters/ApiAdapter";
import useGetTokenDecimals from "./useGetTokenDecimals";
import { formatUnits } from "viem";

export interface DailyTransferType {
  date: string;
  value: string;
}

export function useGetDailyTransfersApi() {
  const { data: decimals, isLoading: getUseGetTokenDecimalsLoading } =
    useGetTokenDecimals();

  const getFormattedDailyTransfers = async () => {
    const dailyTransfers = await getDailyTransfers();
    const dailyTransfersFormatted = new Array<DailyTransferType>();
    for (const dailyTransfer of dailyTransfers) {
      const formattedDate = new Date(dailyTransfer.date)
        .toISOString()
        .split("T")[0];
      const dailyTotalTransfer = dailyTransfer.totalTransfers;
      dailyTransfersFormatted.push({
        date: formattedDate,
        value: formatUnits(dailyTotalTransfer, decimals ? decimals : 18),
      });
    }
    return dailyTransfersFormatted;
  };

  return useQuery({
    queryKey: ["dailyTransfers"],
    queryFn: getFormattedDailyTransfers,
    refetchInterval: 300000, // 5 minutes
    enabled: getUseGetTokenDecimalsLoading,
  });
}
