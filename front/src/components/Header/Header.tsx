import LoginButton from "../LoginButton.tsx";
import LogoutButton from "../LogoutButton.tsx";
import UserAddress from "../UserAddress/UserAddress.tsx";
import RefreshButton from "../RefreshButton.tsx";

import useIsLoggedIn from "../../hooks/useIsLoggedIn.ts";
import useIsUserOwner from "../../hooks/useIsUserOwner.ts";

import "./Header.css";

export default function Header() {
  const isLoggedIn = useIsLoggedIn();
  const isUserOwner = useIsUserOwner();

  return (
    <header>
      <h1>BUSD - Dashboard</h1>
      {isLoggedIn ? (
        <>
          <RefreshButton />
          <a href="#manage-supply">Manage Supply</a>
          <a href="#manage-approvals">Manage Approvals</a>
          <a href="#manage-transfers">Manage Transfers</a>
          <a href="#manage-allowances">Check Allowances</a>
          <a href="#manage-actions">Manage Actions</a>
          {isUserOwner ? (
            <a href="#manage-ownership">Manage Ownership</a>
          ) : (
            <></>
          )}
          <UserAddress />
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </header>
  );
}
