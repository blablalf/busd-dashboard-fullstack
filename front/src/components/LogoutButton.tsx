import { useQueryClient } from "@tanstack/react-query";

import { resetClients } from "../adapters/ClientsAdapter.ts";

export default function LogoutButton() {
  const queryClient = useQueryClient();
  const logout = () => {
    resetClients();
    queryClient.setQueryData(["userAddress"], null);
    queryClient.invalidateQueries({ queryKey: ["userAddress"] });
  };
  return <button onClick={logout}>Logout</button>;
}
