import { FcOk } from "react-icons/fc";

import "./TransactionToast.css";

interface TransactionToastProps {
  message: string;
  hash: string;
}

const TransactionToast = ({ message, hash }: TransactionToastProps) => {
  return (
    <div className="transaction-toast">
      <FcOk />
      <div>{message}</div>
      <a
        href={"https://sepolia.etherscan.io/tx/" + hash}
        target="_blank"
        rel="noopener noreferrer"
      >
        {hash}
      </a>
    </div>
  );
};

export default TransactionToast;
