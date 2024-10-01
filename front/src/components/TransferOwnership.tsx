import { FormEvent } from "react";
import useTransferOwnership from "../hooks/useTransferOwnership";

export default function TransferOwnership() {
  const { mutate: transferOwner } = useTransferOwnership();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const owner = (form.elements.namedItem("owner") as HTMLInputElement).value;

    transferOwner(owner);
  }

  return (
    <form onSubmit={onSubmit}>
      <h3>Transfer ownership</h3>
      <input type="text" placeholder="New owner" name="owner" />
      <button type="submit">Transfer Owner</button>
    </form>
  );
}
