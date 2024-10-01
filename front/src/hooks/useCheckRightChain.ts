import { isRightChainId } from "../adapters/ClientsAdapter.ts";
import useGetChainId from "./useGetChainId.ts";

export default function useCheckRightChain() {
  const { data } = useGetChainId();
  // if chainId is not loaded yet, return true to avoid blocking the UI
  return data === null || data === undefined || isRightChainId(data!);
}
