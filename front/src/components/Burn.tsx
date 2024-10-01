import { parseUnits } from "viem";

import { getStep } from "../utils/Decimals.ts";

import useBurnToken from "../hooks/useBurnToken.ts";
import useGetTokenDecimals from "../hooks/useGetTokenDecimals.ts";

export default function Burn() {
  const { mutate: burn } = useBurnToken();
  const { data: tokenDecimals } = useGetTokenDecimals();
  const stepValue = getStep(tokenDecimals! as number);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const amountElement = form.elements.namedItem("amount") as HTMLInputElement;

    const amount = amountElement.value;

    if (tokenDecimals) {
      const parsedAmount = parseUnits(amount, tokenDecimals as number);
      burn(parsedAmount);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h3>Burn tokens!</h3>
      <input
        type="number"
        step={stepValue ? stepValue : getStep(18)}
        min="0"
        placeholder="Amount"
        name="amount"
      />
      <button type="submit">Burn</button>
    </form>
  );
}
