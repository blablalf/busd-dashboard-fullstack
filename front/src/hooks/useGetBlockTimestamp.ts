import { useQuery } from "@tanstack/react-query";
import { getBlockTimestamp } from "../adapters/ClientsAdapter";

export default function useGetBlockTimestamp(blockNumber: bigint) {
  return useQuery({ queryKey: ["blockNumber"], queryFn: () => getBlockTimestamp(blockNumber), refetchInterval: 5000 });
}
