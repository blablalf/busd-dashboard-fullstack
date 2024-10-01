import { useEffect, useState } from "react";

import { formatUnits } from "viem";

import useGetAllowance from "../hooks/useGetAllowance.ts";
import useGetTokenDecimals from "../hooks/useGetTokenDecimals.ts";

export default function Allowance() {
  const [spender, setSpender] = useState("");
  const [formattedAllowance, setFormattedAllowance] = useState(0);
  const { data: allowance } = useGetAllowance(spender);
  const { data: tokenDecimals } = useGetTokenDecimals();

  useEffect(() => {
    const formattedAllowanceStr = formatUnits(allowance, tokenDecimals!);
    const formattedAllowance = parseFloat(formattedAllowanceStr);
    if (allowance) setFormattedAllowance(formattedAllowance);
  }, [allowance, tokenDecimals, formattedAllowance]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const spenderElement = form.elements.namedItem(
      "spender"
    ) as HTMLInputElement;
    const spender = spenderElement.value;

    setSpender(spender);
  }

  return (
    <form onSubmit={onSubmit}>
      <h3>Check a spender allowance!</h3>
      <input placeholder="Spender address" name="spender" />
      <button type="submit">Check</button>
      <p>Allowance: {formattedAllowance}</p>
    </form>
  );
}
