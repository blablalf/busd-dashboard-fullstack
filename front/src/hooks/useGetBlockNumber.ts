import { useQuery } from "@tanstack/react-query";
import { getBlockNumber } from "../adapters/ClientsAdapter";

export default function useGetBlockNumber() {
  const _getBlockNumber = async () => {
    const blockNumber = await getBlockNumber();
    return blockNumber!.toString();
  } 
  
  return useQuery({ queryKey: ["blockNumber"], queryFn: _getBlockNumber, refetchInterval: 5000 });
}
