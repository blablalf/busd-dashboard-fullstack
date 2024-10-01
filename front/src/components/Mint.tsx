import { useState } from "react";
import { parseUnits } from "viem";

import { getStep } from "../utils/Decimals.ts";

import useMintToken from "../hooks/useMintToken.ts";
import useWatchMintEvent from "../hooks/useWatchMintEvent.ts";
import useGetTokenDecimals from "../hooks/useGetTokenDecimals.ts";

export default function Mint() {
  const [amount, setAmount] = useState(BigInt(0));
  const { mutate: mint } = useMintToken();
  const { data: tokenDecimals } = useGetTokenDecimals();
  const stepValue = getStep(tokenDecimals! as number);
  useWatchMintEvent(amount);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const amountElement = form.elements.namedItem("amount") as HTMLInputElement;

    const amount = amountElement.value;

    const parsedAmount = parseUnits(amount, tokenDecimals! as number);

    mint(parsedAmount);
    setAmount(parsedAmount);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h3>Mint tokens!</h3>
        <input
          type="number"
          step={stepValue ? stepValue : getStep(18)}
          min="0"
          placeholder="Amount"
          name="amount"
        />
        <button type="submit">Mint</button>
      </form>
    </div>
  );
}
