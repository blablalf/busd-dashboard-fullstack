import ModalWrongChain from "./ModalWrongChain/ModalWrongChain.tsx";

import useIsLoggedIn from "../hooks/useIsLoggedIn.ts";

export default function Modals() {
  const isLoggedIn = useIsLoggedIn();
  return (
    <>
      {/* Render modals when wallet connected */}
      {isLoggedIn ? (
        <>
          <ModalWrongChain />
        </>
      ) : null}
    </>
  );
}
