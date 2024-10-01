import useGetTokenOwner from "./useGetTokenOwner.ts";
import useGetUserAddress from "./useGetUserAddress.ts";

export default function useIsUserOwner() {
    const { data: userAddress } = useGetUserAddress();
    const { data: owner } = useGetTokenOwner();
  return userAddress === owner ? true : false;
}
