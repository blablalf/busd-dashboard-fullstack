import { parseUnits } from "viem";

import { getStep } from "../utils/Decimals.ts";

import useTransferToken from "../hooks/useTransferToken.ts";
import useGetTokenDecimals from "../hooks/useGetTokenDecimals.ts";

export default function Transfer() {
  const { mutate: transfer } = useTransferToken();
  const { data: tokenDecimals } = useGetTokenDecimals();
  const stepValue = getStep(tokenDecimals! as number);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const amountElement = form.elements.namedItem("amount") as HTMLInputElement;
    const recipientElement = form.elements.namedItem(
      "recipient"
    ) as HTMLInputElement;

    const amount = amountElement.value;
    const recipient = recipientElement.value;

    const parsedAmount = parseUnits(amount, tokenDecimals! as number);

    transfer({ to: recipient, amount: parsedAmount });
  }

  return (
    <form onSubmit={onSubmit}>
      <h3>Transfer tokens!</h3>
      <input type="text" placeholder="Recipient" name="recipient" />
      <input
        type="number"
        step={stepValue ? stepValue : getStep(18)}
        min="0"
        placeholder="Amount"
        name="amount"
      />
      <button type="submit">Transfer</button>
    </form>
  );
}
