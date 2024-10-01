import { useQuery } from "@tanstack/react-query";

import { getActions } from "../adapters/ApiAdapter.ts";

export default function useGetActions() {
  const actionEvents = async () => {
    return await getActions();
  };

  return useQuery({
    queryKey: ["actions"],
    queryFn: actionEvents,
    refetchInterval: 300000, // 5 minutes
    structuralSharing: false,
  });
}
