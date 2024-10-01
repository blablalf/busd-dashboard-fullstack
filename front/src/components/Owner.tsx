import { ReactNode } from "react";

import useGetTokenOwner from "../hooks/useGetTokenOwner.ts";

export default function Owner() {
  const { data: owner } = useGetTokenOwner();

  return <p>Current owner: {owner! as ReactNode}</p>;
}
