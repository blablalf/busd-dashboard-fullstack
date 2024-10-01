import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function RefreshButton() {
  const queryClient = useQueryClient();
  const refresh = () => {
    queryClient.invalidateQueries(); // Invalidate all queries
    toast.success("Data refreshed");
  };

  return <button onClick={refresh}>Refresh data</button>;
}
