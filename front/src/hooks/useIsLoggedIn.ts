import useGetUserAddress from "./useGetUserAddress.ts";

export default function useIsLoggedIn() {
  const { data } = useGetUserAddress();
  return data ? true : false;
}
