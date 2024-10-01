import { useQuery } from "@tanstack/react-query";

import { getBlockTimestamp, getLastActionsWithBlocksGap, getTokenAddress } from "../adapters/ClientsAdapter.ts";
import useGetUserAddress from "./useGetUserAddress.ts";

export default function useGetLastActions(anyUser: boolean) {
    const { data: userAddress } = useGetUserAddress();
    const tokenAddress = getTokenAddress()!;

    const actionEvents = async () => {
        const logs = await getLastActionsWithBlocksGap(
            tokenAddress,
            anyUser ? undefined : userAddress!,
            10,
            1000
        );
        const timestamps: bigint[] = [];
        if (logs) {
            for (const log of logs) {
                timestamps.push(await getBlockTimestamp(log.blockNumber) as bigint);
            }
            return logs!.map((log, index) => ({
                ...log,
                timestamp: timestamps[index]
            }));
        }
        return [];
    };

    return useQuery({
        queryKey: [anyUser ? "actions" : "userActions", tokenAddress],
        queryFn: actionEvents,
        refetchInterval: 60000,
        structuralSharing: false
    });
}
