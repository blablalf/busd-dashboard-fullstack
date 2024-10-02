import { useQuery } from "@tanstack/react-query";

import { getApprovalsWithBlocksGap, getTokenAddress } from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";

export default function useGetApprovals() {
  const { data: userAddress } = useGetUserAddress();
  
  const getApprovalEventsFrom0ToLastBlock = async () => {
    const approvals = await getApprovalsWithBlocksGap (
      getTokenAddress()!,
      userAddress!,
      1000
    );
    return approvals;
  };

  return useQuery({
    queryKey: ["approvals"],
    queryFn: getApprovalEventsFrom0ToLastBlock,
    enabled: userAddress ? true : false,
    // refetchInterval: 30000000, // 5 minutes
  });
}
