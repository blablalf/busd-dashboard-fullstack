import { parseUnits } from "viem";

import useTransferFromToken from "../hooks/useTransferFromToken.ts";
import useGetTokenDecimals from "../hooks/useGetTokenDecimals.ts";

import { getStep } from "../utils/Decimals.ts";

export default function TransferFrom() {
  const { mutate: transferFromm } = useTransferFromToken();
  const { data: tokenDecimals } = useGetTokenDecimals();
  const stepValue = getStep(tokenDecimals! as number);
  // useWatchTransferEvent(amount);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    const amountElement = form.elements.namedItem("amount") as HTMLInputElement;
    const recipientElement = form.elements.namedItem(
      "recipient"
    ) as HTMLInputElement;
    const senderElement = form.elements.namedItem("sender") as HTMLInputElement;

    const amount = amountElement.value; // Extract the value from the input element
    const recipient = recipientElement.value; // Extract the value from the input element
    const sender = senderElement.value; // Extract the value from the input element

    const parsedAmount = parseUnits(amount, tokenDecimals! as number); // Parse the amount

    transferFromm({
      sender: sender, // Pass the sender value (string)
      recipient: recipient, // Pass the recipient value (string)
      amount: parsedAmount, // Pass the parsed amount (bigint)
    });
    // setAmount(parsedAmount);
  }

  return (
    <form onSubmit={onSubmit}>
      <h3>TransferFrom tokens!</h3>
      <input type="text" placeholder="Sender" name="sender" />
      <input type="text" placeholder="Recipient" name="recipient" />
      <input
        type="number"
        step={stepValue ? stepValue : getStep(18)}
        min="0"
        placeholder="Amount"
        name="amount"
      />
      <button type="submit">TransferFrom</button>
    </form>
  );
}
