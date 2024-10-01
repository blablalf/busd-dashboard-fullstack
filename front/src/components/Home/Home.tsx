import Allowance from "../Allowance.tsx";
import Approve from "../Approve.tsx";
import Burn from "../Burn.tsx";
import Mint from "../Mint.tsx";
import NotConnected from "../NotConnected/NotConnected.tsx";
import Owner from "../Owner.tsx";
import Transfer from "../Transfer.tsx";
import TransferFrom from "../TransferFrom.tsx";
import TransferOwnership from "../TransferOwnership.tsx";
import UserHeader from "../UserHeader/UserHeader.tsx";

import useIsLoggedIn from "../../hooks/useIsLoggedIn.ts";
import useIsUserOwner from "../../hooks/useIsUserOwner.ts";

import "./Home.css";
import LastActionsPanel from "../LastActionsPanel/LastActionsPanel.tsx";
import ApprovalsPanel from "../ApprovalsPanel/ApprovalsPanel.tsx";

export default function Home() {
  const isLoggedIn = useIsLoggedIn();
  const isUserOwner = useIsUserOwner();

  return (
    <div className="home-container">
      {isLoggedIn ? (
        <div className="home-connected-container">
          <UserHeader />
          <div className="double-action-container" id="manage-supply">
            <Mint />
            <Burn />
          </div>
          <div className="double-action-container" id="manage-approvals">
            <Approve />
            <Allowance />
          </div>
          <div className="double-action-container" id="manage-transfers">
            <Transfer />
            <TransferFrom />
          </div>
          {isUserOwner ? (
            <div className="double-action-container" id="manage-ownership">
              <Owner />
              <TransferOwnership />
            </div>
          ) : (
            <></>
          )}
          <ApprovalsPanel />
          <LastActionsPanel />
        </div>
      ) : (
        <NotConnected />
      )}
    </div>
  );
}
