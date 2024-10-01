import { formatEther, formatUnits } from "viem";
import { ReactNode, useEffect, useState } from "react";

import useGetEtherBalance from "../../hooks/useGetEtherBalance.ts";
import useGetTokenUserInfo from "../../hooks/useGetTokenUserInfo.ts";

import { getTokenAddress } from "../../adapters/ClientsAdapter.ts";

import "./UserHeader.css";

export default function UserHeader() {
  const [formattedEtherBalance, setFormattedEtherBalance] = useState("");
  const [formattedSupply, setFormattedSupply] = useState("");
  const [formattedTokenBalance, setFormattedTokenBalance] = useState("");

  const tokenAddress = getTokenAddress();

  const { data: tokenUserData } = useGetTokenUserInfo();
  const { data: etherBalance } = useGetEtherBalance();

  const userTokenBalance = tokenUserData?.balance;
  const tokenTotalSupply = tokenUserData?.totalSupply;
  const tokenDecimals = tokenUserData?.decimals;
  const tokenName = tokenUserData?.name;

  useEffect(() => {
    if (etherBalance) {
      setFormattedEtherBalance(formatEther(BigInt(etherBalance)));
    }
    if (tokenTotalSupply) {
      setFormattedSupply(
        formatUnits(BigInt(tokenTotalSupply), tokenDecimals! as number)
      );
    }
    if (userTokenBalance) {
      setFormattedTokenBalance(
        formatUnits(BigInt(userTokenBalance), tokenDecimals! as number)
      );
    }
  }, [etherBalance, tokenTotalSupply, userTokenBalance, tokenDecimals]);

  return (
    <div className="user-header">
      <div className="header-info-container">
        <div className="header-info">
          <h3>Ether balance</h3>
          <p>{formattedEtherBalance}</p>
        </div>
        <div className="header-info">
          <h3>{tokenName! as ReactNode} address</h3>
          <a
            href={"https://sepolia.etherscan.io/address/" + tokenAddress}
            target="_blank"
            rel="noopener noreferrer"
          >
            {tokenAddress}
          </a>
        </div>
      </div>
      <div className="header-info-container">
        <div className="header-info">
          <h3>{tokenName! as ReactNode} total supply</h3>
          <p>{formattedSupply}</p>
        </div>
        <div className="header-info">
          <h3>Your {tokenName! as ReactNode} balance</h3>
          <p>{formattedTokenBalance}</p>
        </div>
      </div>
    </div>
  );
}
