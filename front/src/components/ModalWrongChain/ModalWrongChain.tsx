import ReactModal from "react-modal";
import { useEffect } from "react";

import { switchChain } from "../../adapters/ClientsAdapter.ts";
import LogoutButton from "../LogoutButton.tsx";

import useCheckRightChain from "../../hooks/useCheckRightChain.ts";

import "./ModalWrongChain.css";

ReactModal.setAppElement("#root");

const ModalWrongChain = () => {
  const isRightChain = useCheckRightChain();

  useEffect(() => {
    if (isRightChain) {
      document.body.style.overflow = "auto";
      console.log("correct chain, modal closed");
    } else {
      document.body.style.overflow = "hidden";
      console.log("wrong chain, modal open");
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isRightChain]);

  return (
    <ReactModal
      isOpen={!isRightChain}
      shouldCloseOnOverlayClick={false}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <h2>Wrong Network</h2>
      {/* <p>You are connected to the following chainId: {chainId}</p> */}
      <div className="button-container">
        <button onClick={switchChain}>Change to Sepolia network</button>
        <LogoutButton />
      </div>
    </ReactModal>
  );
};

export default ModalWrongChain;
