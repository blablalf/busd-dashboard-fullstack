import { useQuery } from "@tanstack/react-query";

import { getApprovalsWithBlocksGap, getTokenAddress } from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";

export default function useGetApprovalEvents() {
    const { data: userAddress } = useGetUserAddress();
    const tokenAddress = getTokenAddress()!;

    const approvalEvents = async () => {
        const logs = await getApprovalsWithBlocksGap(
            tokenAddress,
            userAddress!,
            1000
        );
        return logs;
    };

    return useQuery({
        queryKey: ["approvalEvents", tokenAddress, userAddress!],
        queryFn: approvalEvents,
        refetchInterval: 60000
    });
}
