import { parseUnits } from "viem";

import useApproveToken from "../hooks/useApproveToken.ts";
import useGetTokenDecimals from "../hooks/useGetTokenDecimals.ts";

import { getStep } from "../utils/Decimals.ts";

export default function Approve() {
  const { mutate: approve } = useApproveToken();
  const { data: tokenDecimals } = useGetTokenDecimals();
  const stepValue = getStep(tokenDecimals! as number);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const amountElement = form.elements.namedItem("amount") as HTMLInputElement;
    const spenderElement = form.elements.namedItem(
      "spender"
    ) as HTMLInputElement;

    const amount = amountElement.value;
    const spender = spenderElement.value;

    const parsedAmount = parseUnits(amount, tokenDecimals! as number);

    approve({ spender: spender, amount: parsedAmount });
  }

  return (
    <form onSubmit={onSubmit}>
      <h3>Approve addresses!</h3>
      <input type="text" placeholder="Spender" name="spender" />
      <input
        type="number"
        step={stepValue ? stepValue : getStep(18)}
        min="0"
        placeholder="Amount"
        name="amount"
      />
      <button type="submit">Approve</button>
    </form>
  );
}
